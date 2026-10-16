WITH sorted_heartbeats AS (
  SELECT
    webinarid,
    userid,
    from_iso8601_timestamp(receivedat) AS curr_time,
    LAG(from_iso8601_timestamp(receivedat)) OVER (
      PARTITION BY webinarid, userid 
      ORDER BY from_iso8601_timestamp(receivedat)
    ) AS prev_time,
    duration
  FROM "webinar_heartbeats"
  WHERE userid = '<USER_ID>'
    AND action = 'playing'
    AND consent = true
),
heartbeats_with_intervals AS (
  SELECT
    webinarid,
    userid,
    curr_time,
    duration,
    -- Compute elapsed seconds per heartbeat step
    CASE 
      WHEN date_diff('second', prev_time, curr_time) IS NULL THEN 60          
      WHEN date_diff('second', prev_time, curr_time) <= 180 THEN date_diff('second', prev_time, curr_time)   
      ELSE 60                                    
    END AS step_seconds
  FROM sorted_heartbeats
),
cumulative_engagement AS (
  SELECT
    webinarid,
    userid,
    curr_time,
    duration,
    -- Compute running watch time up to each heartbeat
    SUM(step_seconds) OVER (
      PARTITION BY webinarid, userid 
      ORDER BY curr_time
    ) / 60.0 AS running_watch_minutes
  FROM heartbeats_with_intervals
)
SELECT 
  webinarid,
  ROUND(MAX(running_watch_minutes), 2) AS minutes_spent_watching,
  MAX(duration) AS webinar_duration_minutes,
  ROUND((MAX(running_watch_minutes) / MAX(duration)) * 100, 1) AS watch_percentage,
  
  -- 1. Date & time when the user crossed the 80% mark (Certificate Completion Date)
  MIN(CASE WHEN running_watch_minutes >= (0.80 * duration) THEN curr_time END) AS reached_80_percent_at,
  
  -- 2. Date & time of the user's very last recorded heartbeat
  MAX(curr_time) AS last_viewed_at

FROM cumulative_engagement
GROUP BY webinarid, userid
-- Only keep webinars where total viewing reached at least 80%
HAVING MAX(running_watch_minutes) >= (0.80 * MAX(duration));
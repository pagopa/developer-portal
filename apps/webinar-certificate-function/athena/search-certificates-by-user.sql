WITH sorted_heartbeats AS (
  SELECT
    webinarid,
    userid,
    from_iso8601_timestamp(receivedat) AS curr_time,
    LAG(from_iso8601_timestamp(receivedat)) OVER (
      PARTITION BY webinarid, userid 
      ORDER BY from_iso8601_timestamp(receivedat)
    ) AS prev_time,
    
    -- Pull your duration column here (change to your exact column name)
    duration
  FROM "webinar_analytics"."webinar_heartbeats"
  WHERE userid = '<USER_ID>'
    AND action = 'playing'
),
calculated_engagement AS (
  SELECT
    webinarid,
    userid,
    -- Since duration is the same for every heartbeat row of a specific webinar, 
    -- MAX() safely grabs the value for our comparison.
    MAX(duration) AS webinar_duration_minutes,
    
    -- Calculate total physical engagement minutes spent watching
    SUM(
      CASE 
        WHEN date_diff('second', prev_time, curr_time) IS NULL THEN 60          
        WHEN date_diff('second', prev_time, curr_time) <= 180 THEN date_diff('second', prev_time, curr_time)   
        ELSE 60                                    
      END
    ) / 60.0 AS total_watch_minutes
  FROM sorted_heartbeats
  GROUP BY webinarid, userid
)
SELECT 
  webinarid,
  ROUND(total_watch_minutes, 2) AS minutes_spent_watching,
  webinar_duration_minutes,
  ROUND((total_watch_minutes / webinar_duration_minutes) * 100, 1) AS watch_percentage
FROM calculated_engagement
-- Filter for users who hit or exceed the 80% mark
WHERE total_watch_minutes >= (0.80 * webinar_duration_minutes);
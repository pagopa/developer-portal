WITH QualifiedClients AS (
    -- Step 1: Filter clientips that appear at least 5 times for a specific webinar
    SELECT 
        webinarid, 
        userid
    FROM 
        "webinar_analytics"."webinar_heartbeats"
    where
      year = '2026'
      and month = '04'
      and day = '01'
    GROUP BY 
        webinarid, 
        userid
    HAVING 
        COUNT(*) >= 5
)
-- Step 2: Count the distinct IPs remaining for each webinar
SELECT 
    webinarid, 
    COUNT(userid) AS count_distinct_userid
FROM 
    QualifiedClients
GROUP BY 
    webinarid
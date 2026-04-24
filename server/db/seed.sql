/* B"H */

-- Sample data for barebones climbing tracker database
-- Run this after schema.sql / schema_barebones.sql

-- Users
INSERT INTO users (username, email, image_link, is_admin) VALUES
('cole', 'cole@example.com', 'https://bulma.io/images/placeholders/128x128.png', TRUE),
('maya', 'maya@example.com', 'https://bulma.io/images/placeholders/128x128.png', FALSE),
('josh', 'josh@example.com', 'https://bulma.io/images/placeholders/128x128.png', FALSE),
('sam', 'sam@example.com', 'https://bulma.io/images/placeholders/128x128.png', FALSE);

-- Friendships
-- This uses two rows per friendship so each user can see the other as a friend.
INSERT INTO friendships (user_id, friend_id) VALUES
((SELECT id FROM users WHERE username = 'cole'), (SELECT id FROM users WHERE username = 'maya')),
((SELECT id FROM users WHERE username = 'maya'), (SELECT id FROM users WHERE username = 'cole')),
((SELECT id FROM users WHERE username = 'cole'), (SELECT id FROM users WHERE username = 'josh')),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM users WHERE username = 'cole')),
((SELECT id FROM users WHERE username = 'maya'), (SELECT id FROM users WHERE username = 'sam')),
((SELECT id FROM users WHERE username = 'sam'), (SELECT id FROM users WHERE username = 'maya'));

-- Sessions
INSERT INTO sessions (user_id, title, date, location, type, duration, feeling, notes) VALUES
((SELECT id FROM users WHERE username = 'cole'), 'Evening Boulder Session', '2026-04-10', 'BCs Climbing Gym', 'indoor', 95, 4, 'Good session. Felt strong on overhangs.'),
((SELECT id FROM users WHERE username = 'cole'), 'Rope Endurance Day', '2026-04-13', 'BCs Climbing Gym', 'indoor', 80, 3, 'Focused on mileage and pacing.'),
((SELECT id FROM users WHERE username = 'cole'), 'Outdoor Day at The Gunks', '2026-04-18', 'The Gunks', 'outdoor', 180, 5, 'Great weather. Tried a few classic routes.'),
((SELECT id FROM users WHERE username = 'maya'), 'Quick Boulder Session', '2026-04-12', 'Gravity Vault', 'indoor', 60, 4, 'Short but productive.'),
((SELECT id FROM users WHERE username = 'josh'), 'Projecting Session', '2026-04-14', 'BCs Climbing Gym', 'indoor', 110, 3, 'Worked the same V6 for most of the session.'),
((SELECT id FROM users WHERE username = 'sam'), 'Weekend Rope Session', '2026-04-19', 'The Cliffs', 'indoor', 90, 4, 'Mostly lead climbing.');

-- Climbs for Cole's Evening Boulder Session
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Evening Boulder Session'), 'V4', 'Boulder', 'Flash', 8, 'Clean movement and good footwork.', 'Blue', NULL),
((SELECT id FROM sessions WHERE title = 'Evening Boulder Session'), 'V5', 'Boulder', 'Redpoint', 7, 'Took a few tries but finished it.', 'Red', NULL),
((SELECT id FROM sessions WHERE title = 'Evening Boulder Session'), 'V6', 'Boulder', 'Project', 6, 'Got most of the moves but not the send.', 'Black', NULL);

-- Climbs for Cole's Rope Endurance Day
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Rope Endurance Day'), '5.10a', 'Rope', 'Onsight', 8, 'Felt smooth.', 'Green', NULL),
((SELECT id FROM sessions WHERE title = 'Rope Endurance Day'), '5.10c', 'Rope', 'Redpoint', 7, 'Pumped near the top.', 'Orange', NULL),
((SELECT id FROM sessions WHERE title = 'Rope Endurance Day'), '5.11a', 'Rope', 'Fell/Hung', 5, 'Good endurance practice.', 'Purple', NULL);

-- Climbs for Cole's Outdoor Day
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Outdoor Day at The Gunks'), '5.7', 'Rope', 'Onsight', 9, 'Fun warmup route.', NULL, 'Easy Overhang'),
((SELECT id FROM sessions WHERE title = 'Outdoor Day at The Gunks'), '5.9', 'Rope', 'Redpoint', 8, 'Great movement. Felt secure.', NULL, 'High Exposure'),
((SELECT id FROM sessions WHERE title = 'Outdoor Day at The Gunks'), '5.10a', 'Rope', 'Fell/Hung', 6, 'Crux was harder than expected.', NULL, 'Thin Hands');

-- Climbs for Maya
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Quick Boulder Session'), 'V2', 'Boulder', 'Flash', 8, 'Good warmup.', 'Yellow', NULL),
((SELECT id FROM sessions WHERE title = 'Quick Boulder Session'), 'V3', 'Boulder', 'Redpoint', 7, 'Nice balance problem.', 'Pink', NULL),
((SELECT id FROM sessions WHERE title = 'Quick Boulder Session'), 'V4', 'Boulder', 'Project', 6, 'Close to finishing.', 'White', NULL);

-- Climbs for Josh
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Projecting Session'), 'V5', 'Boulder', 'Flash', 8, 'Good first climb.', 'Green', NULL),
((SELECT id FROM sessions WHERE title = 'Projecting Session'), 'V6', 'Boulder', 'Project', 7, 'Made progress on the crux.', 'Black', NULL);

-- Climbs for Sam
INSERT INTO climbs (session_id, grade, style, attempt, quality, comment, color, name) VALUES
((SELECT id FROM sessions WHERE title = 'Weekend Rope Session'), '5.9', 'Rope', 'Onsight', 8, 'Comfortable lead.', 'Blue', NULL),
((SELECT id FROM sessions WHERE title = 'Weekend Rope Session'), '5.10b', 'Rope', 'Redpoint', 7, 'One fall first try, sent second try.', 'Red', NULL);

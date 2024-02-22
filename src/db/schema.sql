DROP DATABASE IF EXISTS violinistWebsite;
CREATE DATABASE violinistWebsite;
USE violinistWebsite;

CREATE TABLE bio (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50),
  components TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE longFormBio (
  id INT AUTO_INCREMENT NOT NULL,
  bioId INT,
  PRIMARY KEY (id)
);

CREATE TABLE eventGroupings (
  id INT AUTO_INCREMENT NOT NULL,
  dateStart DATETIME,
  dateEnd DATETIME,
  venue VARCHAR(100),
  type VARCHAR(100),
  presenter VARCHAR(100),
  artists MEDIUMTEXT,
  program MEDIUMTEXT,
  PRIMARY KEY (id)
);

CREATE TABLE events (
  id INT AUTO_INCREMENT NOT NULL,
  dateTime DATETIME,
  location MEDIUMTEXT,
  link TEXT,
  eventGroupingId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (eventGroupingId) 
    REFERENCES eventGroupings(id) 
    ON DELETE CASCADE
);

CREATE TABLE contact (
  id INT AUTO_INCREMENT NOT NULL,
  firstname VARCHAR(25),
  lastname VARCHAR(25),
  email VARCHAR(100),
  message TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT NOT NULL,
  src TEXT,
  croppedSrc TEXT,
  photoCred TEXT,
  originalFileName TEXT
  originalCroppedFileName TEXT
  PRIMARY KEY (id)
);

CREATE TABLE videos (
  id INT AUTO_INCREMENT NOT NULL,
  youtubeCode TEXT,
  thumbnail TEXT,
  caption VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE audioTracks (
  id INT AUTO_INCREMENT NOT NULL,
  originalFileName TEXT
  src TEXT,
  author VARCHAR(100),
  title VARCHAR(100),
  PRIMARY KEY (id),
);

CREATE TABLE blogs (
  id INT AUTO_INCREMENT NOT NULL,
  title TEXT,
  components TEXT,
  dateCreated DATETIME,
  dateModified DATETIME,
  PRIMARY KEY (id)
);

CREATE TABLE playlists (
  id INT AUTO_INCREMENT NOT NULL,
  name TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE playlistTracks (
  id INT AUTO_INCREMENT NOT NULL,
  audioTrackId INT NOT NULL,
  playlistId INT NOT NULL,
  position INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (audioTrackId)
    REFERENCES audioTracks(id) 
    ON DELETE CASCADE,
  FOREIGN KEY (playlistId)
    REFERENCES playlists(id) 
    ON DELETE CASCADE 
);

INSERT INTO bio (name, components) VALUES (
  'website',
  '[{"type":"p","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus euismod quis viverra. Feugiat sed lectus vestibulum mattis ullamcorper velit. Id ornare arcu odio ut. Praesent tristique magna sit amet purus. Adipiscing enim eu turpis egestas pretium aenean pharetra magna. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Mauris nunc congue nisi vitae suscipit tellus mauris a. Tristique risus nec feugiat in fermentum posuere. Sed euismod nisi porta lorem mollis aliquam ut. Sed faucibus turpis in eu mi bibendum neque. Et magnis dis parturient montes nascetur ridiculus mus. Ac placerat vestibulum lectus mauris ultrices eros in. Adipiscing at in tellus integer feugiat scelerisque. Cursus metus aliquam eleifend mi in. Enim diam vulputate ut pharetra. Adipiscing tristique risus nec feugiat in fermentum. Aliquam nulla facilisi cras fermentum odio eu. Faucibus vitae aliquet nec ullamcorper sit amet risus. Auctor eu augue ut lectus arcu bibendum at varius vel."},{"type":"p","content":"Sed lectus vestibulum mattis ullamcorper velit. Elementum integer enim neque volutpat ac tincidunt vitae semper. Tellus in metus vulputate eu scelerisque felis imperdiet proin. Eleifend donec pretium vulputate sapien nec sagittis. Et netus et malesuada fames. Proin fermentum leo vel orci porta non pulvinar neque. Hac habitasse platea dictumst quisque sagittis purus. Dui faucibus in ornare quam viverra orci sagittis eu. Porttitor rhoncus dolor purus non. Viverra orci sagittis eu volutpat odio facilisis mauris sit. Vitae tempus quam pellentesque nec nam aliquam sem. Faucibus interdum posuere lorem ipsum dolor."},{"type":"p","content":"Etiam erat velit scelerisque in dictum non consectetur. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce. In metus vulputate eu scelerisque felis. Mi quis hendrerit dolor magna eget est lorem ipsum. Duis at tellus at urna condimentum mattis pellentesque id nibh. Nunc aliquet bibendum enim facilisis gravida neque convallis. Tortor dignissim convallis aenean et tortor at risus. Cursus sit amet dictum sit amet justo donec enim. Nisl nunc mi ipsum faucibus vitae aliquet. Sollicitudin ac orci phasellus egestas tellus. Tristique et egestas quis ipsum. Orci eu lobortis elementum nibh tellus molestie nunc non. Suscipit tellus mauris a diam maecenas sed enim ut sem. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Neque ornare aenean euismod elementum nisi quis eleifend quam. Convallis tellus id interdum velit laoreet id donec ultrices tincidunt."},{"type":"p","content":"Est lorem ipsum dolor sit amet consectetur. Egestas maecenas pharetra convallis posuere morbi. Facilisi etiam dignissim diam quis enim lobortis. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Magna fermentum iaculis eu non diam phasellus vestibulum lorem sed. Id diam maecenas ultricies mi eget. Feugiat sed lectus vestibulum mattis. Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Tincidunt id aliquet risus feugiat in. Dolor sit amet consectetur adipiscing elit. Nisl vel pretium lectus quam id leo in. A condimentum vitae sapien pellentesque habitant morbi. Ornare arcu odio ut sem nulla. Quisque non tellus orci ac. Ipsum a arcu cursus vitae congue mauris. Consectetur adipiscing elit pellentesque habitant morbi. Et netus et malesuada fames. Mauris in aliquam sem fringilla. Mauris ultrices eros in cursus turpis massa tincidunt."},{"type":"p","content":"Venenatis lectus magna fringilla urna porttitor rhoncus dolor. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Urna nunc id cursus metus aliquam eleifend mi. Integer feugiat scelerisque varius morbi enim nunc faucibus. Et malesuada fames ac turpis egestas maecenas pharetra convallis. Enim ut tellus elementum sagittis. Ridiculus mus mauris vitae ultricies leo integer malesuada. Elit ut aliquam purus sit amet. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Sed faucibus turpis in eu mi. Vestibulum rhoncus est pellentesque elit. Viverra mauris in aliquam sem. Feugiat nibh sed pulvinar proin gravida. Cursus sit amet dictum sit. Orci nulla pellentesque dignissim enim sit amet venenatis urna. Velit ut tortor pretium viverra suspendisse potenti nullam ac."}]'
);

INSERT INTO bio (name, components) VALUES (
  'Under 250 words',
  '[{"type":"p","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus euismod quis viverra. Feugiat sed lectus vestibulum mattis ullamcorper velit. Id ornare arcu odio ut. Praesent tristique magna sit amet purus. Adipiscing enim eu turpis egestas pretium aenean pharetra magna. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Mauris nunc congue nisi vitae suscipit tellus mauris a. Tristique risus nec feugiat in fermentum posuere. Sed euismod nisi porta lorem mollis aliquam ut. Sed faucibus turpis in eu mi bibendum neque. Et magnis dis parturient montes nascetur ridiculus mus. Ac placerat vestibulum lectus mauris ultrices eros in. Adipiscing at in tellus integer feugiat scelerisque. Cursus metus aliquam eleifend mi in. Enim diam vulputate ut pharetra. Adipiscing tristique risus nec feugiat in fermentum. Aliquam nulla facilisi cras fermentum odio eu. Faucibus vitae aliquet nec ullamcorper sit amet risus. Auctor eu augue ut lectus arcu bibendum at varius vel."},{"type":"p","content":"Sed lectus vestibulum mattis ullamcorper velit. Elementum integer enim neque volutpat ac tincidunt vitae semper. Tellus in metus vulputate eu scelerisque felis imperdiet proin. Eleifend donec pretium vulputate sapien nec sagittis. Et netus et malesuada fames. Proin fermentum leo vel orci porta non pulvinar neque. Hac habitasse platea dictumst quisque sagittis purus. Dui faucibus in ornare quam viverra orci sagittis eu. Porttitor rhoncus dolor purus non. Viverra orci sagittis eu volutpat odio facilisis mauris sit. Vitae tempus quam pellentesque nec nam aliquam sem. Faucibus interdum posuere lorem ipsum dolor."},{"type":"p","content":"Etiam erat velit scelerisque in dictum non consectetur. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce. In metus vulputate eu scelerisque felis. Mi quis hendrerit dolor magna eget est lorem ipsum. Duis at tellus at urna condimentum mattis pellentesque id nibh. Nunc aliquet bibendum enim facilisis gravida neque convallis. Tortor dignissim convallis aenean et tortor at risus. Cursus sit amet dictum sit amet justo donec enim. Nisl nunc mi ipsum faucibus vitae aliquet. Sollicitudin ac orci phasellus egestas tellus. Tristique et egestas quis ipsum. Orci eu lobortis elementum nibh tellus molestie nunc non. Suscipit tellus mauris a diam maecenas sed enim ut sem. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Neque ornare aenean euismod elementum nisi quis eleifend quam. Convallis tellus id interdum velit laoreet id donec ultrices tincidunt."}]'
);


INSERT INTO bio (name, components) VALUES (
  'madeupTitle',
  '[{"type":"p","content":"asdfasdfasdfasfd"},{"type":"p","content":"qwefqwefqwef"}]'
);

INSERT longFormBio (bioId) VALUES (1);

INSERT INTO eventGroupings (
  dateStart,
  dateEnd,
  venue,
  type,
  presenter,
  artists,
  program
) VALUES (
  '2023-06-29T00:00:00',
  '2023-07-01T00:00:00',
  '',
  '',
  'Melbourne Symphony Orchestra',
  '[{"name":"Melbourne Symphony Orchestra","medium":""},{"name":"Ray Chen","medium":"violinist"},{"name":"Jaime Martín","medium":"conductor"}]',
  '[{"composer":"Tchaikovsky","arranger":"","work":"Violin Concerto"}]'
);

INSERT INTO events (
  dateTime,
  location,
  link,
  eventGroupingId
) VALUES (
  '2023-06-29T19:30:00',
  '{"country":"","stateOrProvince":"","city":"","venue":"Hamer Hall"}',
  'https://www.mso.com.au/performance/2023-winter-gala-ray-chen-performs-tchaikovsky',
  1
);

INSERT INTO events (
  dateTime,
  location,
  link,
  eventGroupingId
) VALUES (
  '2023-06-30T19:30:00',
  '{"country":"","stateOrProvince":"Geelong","city":"","venue":"Costa Hall"}',
  'https://www.mso.com.au/performance/2023-winter-gala-ray-chen-performs-tchaikovsky',
  1
);

INSERT INTO events (
  dateTime,
  location,
  link,
  eventGroupingId
) VALUES (
  '2023-07-01T14:00:00',
  '{"country":"","stateOrProvince":"","city":"","venue":"Hamer Hall"}',
  'https://www.mso.com.au/performance/2023-winter-gala-ray-chen-performs-tchaikovsky',
  1
);

INSERT INTO eventGroupings (
  dateStart,
  dateEnd,
  venue,
  type,
  presenter,
  artists,
  program
) VALUES (
  '2023-08-15T00:00:00',
  '2023-08-15T00:00:00',
  'Lotte Concert Hall',
  'Chamber Music Concert',
  'Lotte Music Festival',
  '[{"name":"Andreas Ottensamer","medium":"Clarinet"},{"name":"Jinjoo Cho","medium":"Violin"},{"name":"William Youn","medium":"Piano"},{"name":"Suliman Tekalli","medium":"Violin"}]',
  '[{"composer":"J. Brahms","work":"2 Waltzes in A Major, Op. 39, No. 15 & Op. 52, No. 6","arranger":"Stephan Koncz"},{"composer":"J. Brahms","arranger":"","work":"Hungarian Dances No. 7, WoO1"},{"composer":"J. Brahms","arranger":"","work":"J.Brahms Clarinet Quintet in b minor, Op. 115"}]'
);


INSERT INTO events (
  dateTime,
  location,
  link,
  eventGroupingId
) VALUES (
  '2023-08-15T17:00:00',
  '{"country":"","stateOrProvince":"","city":"Seoul","venue":"Lotte Concert Hall"}',
  'https://www.lotteconcerthall.com/eng/Performance/ConcertDetails/259892',
  2
);

INSERT INTO photos (fileName) VALUES ('st_violin_1.jpg');
INSERT INTO photos (fileName) VALUES ('st_violin_2.jpg');
INSERT INTO photos (fileName) VALUES ('st_violin_3.jpg');
INSERT INTO photos (fileName) VALUES ('st_violin_4.jpg');
INSERT INTO photos (fileName) VALUES ('st_violin_5.jpg');
INSERT INTO photos (fileName) VALUES ('st_violin_6.jpg');

INSERT INTO videos (url) VALUES ('youtubelink1');
INSERT INTO videos (url) VALUES ('youtubelink2');
INSERT INTO videos (url) VALUES ('youtubelink3');
INSERT INTO videos (url) VALUES ('youtubelink4');
INSERT INTO videos (url) VALUES ('youtubelink5');
INSERT INTO videos (url) VALUES ('youtubelink6');
INSERT INTO videos (url) VALUES ('youtubelink7');

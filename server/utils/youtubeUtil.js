// import { google } from "googleapis";
// import googleapis from "googleapis";

// const youtube = google.youtube({
//   version: "v3",
//   auth: process.env.YOUTUBE_API_KEY, // Set API key here if needed
// });


// // YouTube API configuration
// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
// export const PLAYLIST_IDS = {
//   'LeetCode': 'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr',
//   'Codeforces': 'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
//   'CodeChef': 'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr'
// };

// /**
//  * Fetches all videos from a YouTube playlist (handles pagination)
//  * @param {string} playlistId - The ID of the YouTube playlist
//  * @returns {Promise<Array>} - Array of video items
//  */
// export const fetchPlaylistVideos = async (playlistId) => {
//     try {
//       let videos = [];
//       let nextPageToken = null;
  
//       do {
//         const response = await youtube.playlistItems.list({
//           key: YOUTUBE_API_KEY,
//           part: 'snippet',
//           playlistId: playlistId,
//           maxResults: 50,
//           pageToken: nextPageToken,
//         });
  
//         videos = videos.concat(response.data.items);
//         nextPageToken = response.data.nextPageToken || null; // Get next page token
//       } while (nextPageToken); // Keep fetching if there are more pages
//       console.log(`hello:${videos}`)
//       return videos;
//     } catch (error) {
//       console.error('Error fetching playlist videos:', error);
//       throw error;
//     }
//   };
  

// /**
//  * Searches for a video in a playlist based on a contest title
//  * @param {string} platform - The platform (LeetCode, Codeforces, CodeChef)
//  * @param {string} contestTitle - The title of the contest
//  * @returns {Promise<Object|null>} - Matching video or null if not found
//  */
// export const findVideoByContestTitle = async (platform, contestTitle) => {
//   try {
//     const playlistId = PLAYLIST_IDS[platform];
//     if (!playlistId) {
//       throw new Error(`No playlist ID found for platform: ${platform}`);
//     }
    
//     const videos = await fetchPlaylistVideos(playlistId);
    
//     // Clean up the contest title for better matching
//     const cleanTitle = contestTitle.toLowerCase()
//       .replace(/contest/g, '')
//       .replace(/round/g, 'round ')
//       .replace(/div\./g, 'div')
//       .replace(/division/g, 'div')
//       .replace(/\s+/g, ' ')
//       .trim();
    
//     // Find the best matching video
//     let bestMatch = null;
//     let bestMatchScore = 0;
    
//     for (const video of videos) {
//       const videoTitle = video.snippet.title.toLowerCase();
      
//       // Calculate a simple match score
//       let score = 0;
//       const titleWords = cleanTitle.split(' ');
      
//       for (const word of titleWords) {
//         if (word.length > 2 && videoTitle.includes(word)) {
//           score += 1;
//         }
//       }
      
//       if (score > bestMatchScore) {
//         bestMatchScore = score;
//         bestMatch = video;
//       }
//     }
    
//     // Return the best match if it's good enough
//     if (bestMatchScore >= 2) {
//       return {
//         videoId: bestMatch.snippet.resourceId.videoId,
//         title: bestMatch.snippet.title,
//         url: `https://www.youtube.com/watch?v=${bestMatch.snippet.resourceId.videoId}`
//       };
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Error finding video by contest title:', error);
//     throw error;
//   }
// };

// export default {
//   fetchPlaylistVideos,
//   findVideoByContestTitle,
//   PLAYLIST_IDS
// };


import { google } from "googleapis";
import { RateLimitError, ApiConnectionError } from "../utils/errors.js";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_IDS = {
  'LeetCode': 'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr',
  'Codeforces': 'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
  'CodeChef': 'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr'
};

const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

const fetchPlaylistVideos = async (playlistId) => {
  try {
    let videos = [];
    let nextPageToken = null;
    let retryCount = 0;
    const maxRetries = 3;

    do {
      try {
        const response = await youtube.playlistItems.list({
          part: 'snippet',
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        videos = videos.concat(response.data.items);
        nextPageToken = response.data.nextPageToken;
      } catch (error) {
        if (error.code === 403 && error.message.includes('quotaExceeded')) {
          if (retryCount++ < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          throw new RateLimitError('YouTube API quota exceeded');
        }
        throw new ApiConnectionError('YouTube API connection failed');
      }
    } while (nextPageToken);

    return videos;
  } catch (error) {
    console.error(`Error fetching playlist ${playlistId}:`, error);
    throw error;
  }
};

const findVideoByContestTitle = async (platform, contestTitle) => {
  try {
    const playlistId = PLAYLIST_IDS[platform];
    if (!playlistId) {
      throw new ValidationError(`Unsupported platform: ${platform}`);
    }

    const videos = await fetchPlaylistVideos(playlistId);
    const normalizedTitle = normalizeString(contestTitle);

    const matches = videos.map(video => ({
      video,
      score: calculateMatchScore(normalizedTitle, normalizeString(video.snippet.title))
    })).filter(m => m.score > 0);

    if (matches.length === 0) return null;

    const bestMatch = matches.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    return bestMatch.score >= 0.6 ? formatVideoResult(bestMatch.video) : null;
  } catch (error) {
    console.error('Video search failed:', error);
    throw new ApiConnectionError('Failed to search YouTube videos');
  }
};

// Helper functions
const normalizeString = (str) => {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const calculateMatchScore = (a, b) => {
  const aWords = new Set(a.split(' '));
  const bWords = new Set(b.split(' '));
  const intersection = new Set([...aWords].filter(x => bWords.has(x)));
  return intersection.size / Math.max(aWords.size, bWords.size);
};

const formatVideoResult = (video) => ({
  videoId: video.snippet.resourceId.videoId,
  title: video.snippet.title,
  url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
  thumbnail: video.snippet.thumbnails?.high?.url
});

export default {
  fetchPlaylistVideos,
  findVideoByContestTitle,
  PLAYLIST_IDS
};
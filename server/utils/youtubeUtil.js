
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
import {logR} from '@/services/utils';
import instance from './main';

// sidebar: {
//   active: false,
//   rows: [],
//   userInfo: {progress: {currentProgress: 0, commonProgress: 0}},
// },

const path = '/userDB/user_stats_by_stories';

class ApiUserStatsByStory {
  async updateStats(modelUpdateStats) {
    logR('warn', 'Update stats');
    return instance.post(`${path}/update`, modelUpdateStats);
  }
  async getStatsUsers() {
    logR('warn', 'getStatsUsers');
    return instance.get(`${path}/index`);
  }

  async getStatsCurrentUser() {
    logR('warn', 'getStatsCurrentUser');
    return instance.get(`${path}/findMyStats`);
  }

  async getStatsByUserId(userId) {
    logR('warn', 'getStatsByUserId');
    return instance.get(`${path}/finByUserId/${userId}`);
  }

  async getStatsByStoryId(storyId) {
    logR('warn', 'getStatsByStoryId');
    return instance.get(`${path}/findByStoryId/${storyId}`);
  }

  async getMyStatsByStoryId(storyId) {
    logR('warn', 'getStatsForUsersByStoryId');
    return instance.get(`${path}/findMyStatsByStoryId/${storyId}`);
  }
  async delete(statsId) {
    logR('warn', 'deleteStats');
    return instance.delete(`${path}/delete/${statsId}`);
  }
}

export default new ApiUserStatsByStory();

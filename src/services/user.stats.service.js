import ApiUserStatsByStory from '@/api/api.user.stats';
import {decorateResponseApi, decorateResponseDataArray} from './utils';
import {logR} from './utils';

class UserStatsService {
  async updateStats(modelUpdateStats) {
    logR('warn', 'updateStats');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.updateStats,
      modelUpdateStats
    );
    return response;
  }

  async getStatsUsers() {
    logR('warn', 'getStatsUsers');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.getStatsUsers
    );
    return decorateResponseDataArray(response);
  }

  async getStatsCurrentUser() {
    logR('warn', 'getStatsCurrentUser');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.getStatsCurrentUser
    );
    return decorateResponseDataArray(response);
  }

  async getStatsByUserId(userId) {
    logR('warn', 'getStatsByUserId');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.getStatsByUserId,
      userId
    );
    return decorateResponseDataArray(response);
  }

  async getStatsByStoryId(storyId) {
    logR('warn', 'getStatsByStoryId');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.getStatsByStoryId,
      storyId
    );
    return decorateResponseDataArray(response);
  }

  async getStatsForUsersByStoryId(storyId) {
    logR('warn', 'getStatsForUsersByStoryId');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.getMyStatsByStoryId,
      storyId
    );
    if (response.status === 200) {
      return response.data;
    }
    return [];
  }

  async deleteStats(storyId) {
    logR('warn', 'deleteStats');
    const response = await decorateResponseApi(
      ApiUserStatsByStory.delete,
      storyId
    );
    return response;
  }
}

export default new UserStatsService();


import { GitHubUser, GitHubRepo } from '../types';

const BASE_URL = 'https://api.github.com';

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('User not found');
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  let allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    // We use type=owner to get repos owned by the user, but we still need to filter forks manually 
    // because the API can be inconsistent with 'type' parameters on the public endpoint.
    const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const repos: any[] = await response.json();
    
    // STRICT FILTER: Only keep repositories that are NOT forks and are owned by this specific user
    const filtered = repos.filter((repo: any) => !repo.fork && repo.owner.login.toLowerCase() === username.toLowerCase());
    
    allRepos = [...allRepos, ...filtered];
    
    if (repos.length < perPage) {
      hasMore = false;
    } else {
      page++;
    }
    
    if (page > 10) hasMore = false;
  }

  return allRepos;
};

export const searchGitHubUsers = async (query: string): Promise<Partial<GitHubUser>[]> => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=6`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

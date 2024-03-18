export default interface GitHubRepoData {
  id: number;
  owner: string;
  owner_url: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stars: number;
  language: string | null;
  topics: string[] | undefined;
  license: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
    node_id: string;
  } | null;
}

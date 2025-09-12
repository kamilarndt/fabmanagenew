// import config from '../lib/config'

export type SpeckleStream = {
  id: string
  name: string
  description?: string
  updatedAt?: string
}

export type SpeckleCommit = {
  id: string
  message?: string
  createdAt?: string
  authorName?: string
}

function getServer(): string {
  const server = (import.meta.env.VITE_SPECKLE_SERVER as string) || 'https://speckle.xyz'
  return server.replace(/\/$/, '')
}

function getToken(): string | undefined {
  return (import.meta.env.VITE_SPECKLE_TOKEN as string) || undefined
}

async function apiGet<T>(path: string): Promise<T> {
  const server = getServer()
  const token = getToken()
  const res = await fetch(`${server}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  if (!res.ok) throw new Error(`Speckle request failed: ${res.status}`)
  return res.json() as Promise<T>
}

async function graphqlQuery<T>(query: string, variables?: any): Promise<T> {
  const server = getServer()
  const token = getToken()
  const res = await fetch(`${server}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables })
  })
  if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`)
  const data = await res.json()
  if (data.errors) throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
  return data.data
}

export async function listStreams(): Promise<SpeckleStream[]> {
  try {
    // Try GraphQL first (for local Speckle servers)
    const data = await graphqlQuery<{ user: { streams: { items: SpeckleStream[] } } }>(`
      query {
        user {
          streams {
            items {
              id
              name
              description
            }
          }
        }
      }
    `)
    return data.user.streams.items
  } catch {
    try {
      // Fallback to REST API (for public Speckle servers)
      const data = await apiGet<{ streams: SpeckleStream[] | { items: SpeckleStream[] } }>(`/api/streams?limit=50`)
      const streams = Array.isArray((data as any).streams)
        ? (data as any).streams
        : ((data as any).streams?.items || [])
      return streams as SpeckleStream[]
    } catch {
      // Fallback mock data for demo/offline
      return [
        { id: 'demo-stream-a', name: 'Demo – Stoisko targowe', description: 'Przykładowy projekt' },
        { id: 'demo-stream-b', name: 'Demo – Lobby Hotelowe' }
      ]
    }
  }
}

export async function listCommits(streamId: string): Promise<SpeckleCommit[]> {
  try {
    // Try GraphQL first (for local Speckle servers)
    const data = await graphqlQuery<{ stream: { commits: { items: SpeckleCommit[] } } }>(`
      query($streamId: String!) {
        stream(id: $streamId) {
          commits {
            items {
              id
              message
              createdAt
              authorName
            }
          }
        }
      }
    `, { streamId })
    return data.stream.commits.items
  } catch {
    try {
      // Fallback to REST API (for public Speckle servers)
      const data = await apiGet<{ commits: SpeckleCommit[] | { items: SpeckleCommit[] } }>(`/api/streams/${streamId}/commits?limit=50`)
      const commits = Array.isArray((data as any).commits)
        ? (data as any).commits
        : ((data as any).commits?.items || [])
      return commits as SpeckleCommit[]
    } catch {
      return [
        { id: 'demo-commit-1', message: 'Wersja 1' },
        { id: 'demo-commit-2', message: 'Wersja 2' }
      ]
    }
  }
}

export function buildCommitUrl(streamId: string, commitId: string): string {
  const server = getServer()
  return `${server}/streams/${streamId}/commits/${commitId}`
}

import { callEdgeFunction } from '../lib/httpClient'

export type SpeckleAuthResponse = {
  token: string
  expiresAt: string
}

export async function getSpeckleAuthToken(streamUrl: string): Promise<SpeckleAuthResponse> {
  return await callEdgeFunction<SpeckleAuthResponse>('speckle-auth', { streamUrl })
}



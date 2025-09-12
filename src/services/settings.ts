import { httpClient as http } from '../lib/httpClient'

export type FilesRootStatus = {
    path: string
    exists: boolean
    writable: boolean
}

export async function getFilesRoot(): Promise<FilesRootStatus> {
    return http.get('/api/settings/files-root')
}

export async function setFilesRoot(path: string): Promise<{ ok: boolean; path: string }> {
    return http.post('/api/settings/files-root', { path })
}

export type DbStatus = {
    path: string
    exists: boolean
    projectsRoot: string
}

export async function getDbStatus(): Promise<DbStatus> {
    return http.get('/admin/db-status')
}

export async function backupDb(): Promise<{ ok: boolean; latest: string; stamped: string }> {
    return http.post('/admin/db-backup')
}



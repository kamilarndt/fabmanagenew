import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    name: string
    email: string
    role: 'designer' | 'manager' | 'admin' | 'team_lead'
    avatar?: string
    department?: string
    skills?: string[]
    workload?: number // 0-100%
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Team {
    id: string
    name: string
    description?: string
    color: string
    members: string[] // User IDs
    teamLead: string // User ID
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface UsersState {
    users: User[]
    teams: Team[]

    // User actions
    addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateUser: (id: string, updates: Partial<User>) => void
    deleteUser: (id: string) => void
    getUserById: (id: string) => User | undefined
    getUsersByRole: (role: User['role']) => User[]
    getActiveUsers: () => User[]

    // Team actions
    addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateTeam: (id: string, updates: Partial<Team>) => void
    deleteTeam: (id: string) => void
    getTeamById: (id: string) => Team | undefined
    getActiveTeams: () => Team[]
    addMemberToTeam: (teamId: string, userId: string) => void
    removeMemberFromTeam: (teamId: string, userId: string) => void

    // Utility actions
    getTeamMembers: (teamId: string) => User[]
    getUserTeams: (userId: string) => Team[]
}

// Mock data
const MOCK_USERS: User[] = [
    {
        id: 'user-1',
        name: 'Kamil Arndt',
        email: 'kamil.arndt@fabmanage.com',
        role: 'designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kamil',
        department: 'Design',
        skills: ['CAD', '3D Modeling', 'CNC Programming'],
        workload: 75,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: 'user-2',
        name: 'Anna Kowalska',
        email: 'anna.kowalska@fabmanage.com',
        role: 'designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
        department: 'Design',
        skills: ['Interior Design', 'Project Management'],
        workload: 60,
        isActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
    },
    {
        id: 'user-3',
        name: 'Tomasz Nowak',
        email: 'tomasz.nowak@fabmanage.com',
        role: 'team_lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tomasz',
        department: 'Production',
        skills: ['CNC Operation', 'Assembly', 'Quality Control'],
        workload: 80,
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: 'user-4',
        name: 'Józef Kowalski',
        email: 'jozef.kowalski@fabmanage.com',
        role: 'team_lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jozef',
        department: 'Production',
        skills: ['Assembly', 'Installation', 'Project Coordination'],
        workload: 70,
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: 'user-5',
        name: 'Maria Wiśniewska',
        email: 'maria.wisniewska@fabmanage.com',
        role: 'manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        department: 'Management',
        skills: ['Project Management', 'Client Relations', 'Budget Planning'],
        workload: 90,
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
    }
]

const MOCK_TEAMS: Team[] = [
    {
        id: 'team-1',
        name: 'Ekipa Tomka',
        description: 'Zespół produkcyjny specjalizujący się w montażu i instalacji',
        color: '#52c41a',
        members: ['user-3', 'user-6', 'user-7'],
        teamLead: 'user-3',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: 'team-2',
        name: 'Ekipa Józefa',
        description: 'Zespół montażowy z doświadczeniem w projektach komercyjnych',
        color: '#fa8c16',
        members: ['user-4', 'user-8', 'user-9'],
        teamLead: 'user-4',
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    }
]

export const useUsersStore = create<UsersState>()(
    persist(
        (set, get) => ({
            users: MOCK_USERS,
            teams: MOCK_TEAMS,

            // User actions
            addUser: (userData) => {
                const newUser: User = {
                    ...userData,
                    id: `user-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                set((state) => ({
                    users: [...state.users, newUser]
                }))
            },

            updateUser: (id, updates) => {
                set((state) => ({
                    users: state.users.map((user) =>
                        user.id === id
                            ? { ...user, ...updates, updatedAt: new Date() }
                            : user
                    )
                }))
            },

            deleteUser: (id) => {
                set((state) => ({
                    users: state.users.filter((user) => user.id !== id),
                    teams: state.teams.map((team) => ({
                        ...team,
                        members: team.members.filter((memberId) => memberId !== id)
                    }))
                }))
            },

            getUserById: (id) => {
                return get().users.find((user) => user.id === id)
            },

            getUsersByRole: (role) => {
                return get().users.filter((user) => user.role === role && user.isActive)
            },

            getActiveUsers: () => {
                return get().users.filter((user) => user.isActive)
            },

            // Team actions
            addTeam: (teamData) => {
                const newTeam: Team = {
                    ...teamData,
                    id: `team-${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                set((state) => ({
                    teams: [...state.teams, newTeam]
                }))
            },

            updateTeam: (id, updates) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === id
                            ? { ...team, ...updates, updatedAt: new Date() }
                            : team
                    )
                }))
            },

            deleteTeam: (id) => {
                set((state) => ({
                    teams: state.teams.filter((team) => team.id !== id)
                }))
            },

            getTeamById: (id) => {
                return get().teams.find((team) => team.id === id)
            },

            getActiveTeams: () => {
                return get().teams.filter((team) => team.isActive)
            },

            addMemberToTeam: (teamId, userId) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === teamId
                            ? {
                                ...team,
                                members: team.members.includes(userId)
                                    ? team.members
                                    : [...team.members, userId],
                                updatedAt: new Date()
                            }
                            : team
                    )
                }))
            },

            removeMemberFromTeam: (teamId, userId) => {
                set((state) => ({
                    teams: state.teams.map((team) =>
                        team.id === teamId
                            ? {
                                ...team,
                                members: team.members.filter((id) => id !== userId),
                                updatedAt: new Date()
                            }
                            : team
                    )
                }))
            },

            // Utility actions
            getTeamMembers: (teamId) => {
                const team = get().getTeamById(teamId)
                if (!team) return []
                return team.members
                    .map((userId) => get().getUserById(userId))
                    .filter((user): user is User => user !== undefined)
            },

            getUserTeams: (userId) => {
                return get().teams.filter((team) => team.members.includes(userId))
            }
        }),
        {
            name: 'users-store',
            version: 1
        }
    )
)

import { beforeEach, describe, expect, it } from 'vitest'
import { useTasksStore } from '../tasksStore'

describe('tasksStore', () => {
  beforeEach(() => {
    // reset to initial
    const initial = [
      { id: '1', title: 'A', completed: false },
      { id: '2', title: 'B', completed: true }
    ]
    useTasksStore.setState({ tasks: initial as any })
  })

  it('adds a task', () => {
    useTasksStore.getState().addTask({ title: 'New', completed: false })
    const tasks = useTasksStore.getState().tasks
    expect(tasks.some(t => t.title === 'New')).toBe(true)
  })

  it('toggles task', () => {
    useTasksStore.getState().toggleTask('1')
    const t = useTasksStore.getState().tasks.find(t => t.id === '1')
    expect(t?.completed).toBe(true)
  })

  it('updates task', () => {
    useTasksStore.getState().updateTask('2', { title: 'B2' })
    const t = useTasksStore.getState().tasks.find(t => t.id === '2')
    expect(t?.title).toBe('B2')
  })
})






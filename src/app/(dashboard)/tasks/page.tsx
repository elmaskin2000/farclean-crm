import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTask, updateTaskStatus } from '@/app/actions/task'

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: { assignedUser: true },
    orderBy: { createdAt: 'desc' }
  })
  
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No tasks found.</div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{task.description}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{task.assignedUser.name}</Badge>
                          <Badge variant={task.priority === 'HIGH' || task.priority === 'URGENT' ? 'destructive' : 'default'}>{task.priority}</Badge>
                          <Badge variant="secondary">{task.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== 'DONE' && (
                          <form action={async () => {
                            'use server'
                            await updateTaskStatus(task.id, 'DONE')
                          }}>
                            <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">Mark Done</Button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select name="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedUserId">Assign To *</Label>
                  <select name="assignedUserId" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <Button type="submit" className="w-full">Create Task</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

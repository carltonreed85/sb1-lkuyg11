import React, { useState } from 'react';
import { Plus, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Referral } from '../../../contexts/ReferralContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

interface ReferralTasksProps {
  referral: Referral;
}

export default function ReferralTasks({ referral }: ReferralTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review patient history',
      description: 'Complete review of patient medical history before appointment',
      dueDate: '2024-03-20',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Math.random().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '' });
    setShowAddTask(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg border p-4 ${
              task.completed ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border ${
                  task.completed
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300'
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    task.completed ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      {showAddTask ? (
        <form onSubmit={handleAddTask} className="bg-white rounded-lg border p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Task
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      )}
    </div>
  );
}
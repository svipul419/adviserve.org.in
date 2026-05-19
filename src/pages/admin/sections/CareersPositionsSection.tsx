// src/pages/admin/sections/CareersPositionsSection.tsx
import { Plus, Trash2, Eye, EyeOff, Pencil as Edit } from 'lucide-react';
import { ConfirmDialog } from '../../../components/admin';

interface JobPosition {
  id?: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  is_visible: boolean;
  sort_order: number;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract'];

type Props = {
  positions: JobPosition[];
  positionsLoading: boolean;
  showPositionForm: boolean;
  setShowPositionForm: (v: boolean) => void;
  editingPosition: JobPosition | null;
  deletePositionId: string | null;
  setDeletePositionId: (v: string | null) => void;
  positionForm: JobPosition;
  setPositionForm: (v: JobPosition) => void;
  handlePositionSubmit: (e: React.FormEvent) => void;
  handleEditPosition: (pos: JobPosition) => void;
  confirmDeletePosition: () => void;
  togglePositionVisibility: (id: string, currentVisibility: boolean) => void;
  resetPositionForm: () => void;
};

export function CareersPositionsSection({
  positions, positionsLoading, showPositionForm, setShowPositionForm,
  editingPosition, deletePositionId, setDeletePositionId,
  positionForm, setPositionForm, handlePositionSubmit, handleEditPosition,
  confirmDeletePosition, togglePositionVisibility, resetPositionForm,
}: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Job Positions</h2>
        <button
          onClick={() => { resetPositionForm(); setShowPositionForm(!showPositionForm); }}
          className="bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Position
        </button>
      </div>

      {/* Position Form */}
      {showPositionForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingPosition ? 'Edit Position' : 'Add New Position'}
          </h3>
          <form onSubmit={handlePositionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={positionForm.title}
                  onChange={(e) => setPositionForm({ ...positionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input
                  type="text"
                  required
                  value={positionForm.department}
                  onChange={(e) => setPositionForm({ ...positionForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={positionForm.location}
                  onChange={(e) => setPositionForm({ ...positionForm, location: e.target.value })}
                  placeholder="e.g. Remote, Hybrid — Mumbai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={positionForm.type}
                  onChange={(e) => setPositionForm({ ...positionForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={positionForm.sort_order}
                  onChange={(e) => setPositionForm({ ...positionForm, sort_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={positionForm.description}
                onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visible</label>
              <select
                value={positionForm.is_visible ? 'true' : 'false'}
                onChange={(e) => setPositionForm({ ...positionForm, is_visible: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80"
              >
                {editingPosition ? 'Update' : 'Create'} Position
              </button>
              <button
                type="button"
                onClick={resetPositionForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Positions Table */}
      <div className="bg-white rounded-xl shadow">
        {positionsLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood-primary mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No job positions yet. Click &quot;Add Position&quot; to create your first one.
                    </td>
                  </tr>
                ) : (
                  positions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{pos.title}</div>
                        <div className="text-sm text-gray-500">{pos.type}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{pos.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{pos.department}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
 pos.is_visible
 ? 'bg-green-100 text-green-800'
 : 'bg-gray-100 text-gray-800'
 }`}
                        >
                          {pos.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => togglePositionVisibility(pos.id!, pos.is_visible ?? false)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={pos.is_visible ? 'Hide position' : 'Show position'}
                          >
                            {pos.is_visible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleEditPosition(pos)}
                            className="text-oxblood-primary hover:text-oxblood-hover/80"
                            aria-label="Edit position"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeletePositionId(pos.id!)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete position"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deletePositionId}
        title="Delete Position"
        message="Are you sure? This action cannot be undone."
        onConfirm={confirmDeletePosition}
        onCancel={() => setDeletePositionId(null)}
      />
    </>
  );
}

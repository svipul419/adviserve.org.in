// src/pages/admin/sections/EmailCampaignFormSection.tsx

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

interface EmailList {
  id: string;
  name: string;
  subscriber_count: number;
}

interface FormData {
  name: string;
  template_id: string;
  list_id: string;
}

type Props = {
  formData: FormData;
  setFormData: (v: FormData) => void;
  templates: EmailTemplate[];
  lists: EmailList[];
  error: string | null;
  success: string | null;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const inputCls =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function EmailCampaignFormSection({
  formData,
  setFormData,
  templates,
  lists,
  error,
  success,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="mb-8 bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Campaign</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Campaign Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Email Template</label>
          <select
            required
            value={formData.template_id}
            onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
            className={inputCls}
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Email List (Optional)</label>
          <select
            value={formData.list_id}
            onChange={(e) => setFormData({ ...formData, list_id: e.target.value })}
            className={inputCls}
          >
            <option value="">Select later</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.subscriber_count} subscribers)
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Create Campaign'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

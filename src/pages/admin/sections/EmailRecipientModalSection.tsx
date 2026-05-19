// src/pages/admin/sections/EmailRecipientModalSection.tsx
import { RefObject } from 'react';
import { Send } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  template_id: string | null;
  list_id: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

interface EmailList {
  id: string;
  name: string;
  subscriber_count: number;
}

interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface FormData {
  name: string;
  template_id: string;
  list_id: string;
}

type Props = {
  modalRef: RefObject<HTMLDivElement>;
  selectedCampaign: Campaign;
  lists: EmailList[];
  subscribers: EmailSubscriber[];
  sendOption: 'list' | 'individual';
  setSendOption: (v: 'list' | 'individual') => void;
  selectedEmails: string[];
  customEmail: string;
  setCustomEmail: (v: string) => void;
  formData: FormData;
  setFormData: (v: FormData) => void;
  error: string | null;
  success: string | null;
  onToggleEmail: (email: string) => void;
  onAddCustomEmail: () => void;
  onClose: () => void;
  onRequestSend: (campaignId: string) => void;
};

export function EmailRecipientModalSection({
  modalRef,
  selectedCampaign,
  lists,
  subscribers,
  sendOption,
  setSendOption,
  selectedEmails,
  customEmail,
  setCustomEmail,
  formData,
  setFormData,
  error,
  success,
  onToggleEmail,
  onAddCustomEmail,
  onClose,
  onRequestSend,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Send Campaign: {selectedCampaign.name}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send to:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="list"
                  checked={sendOption === 'list'}
                  onChange={(e) => setSendOption(e.target.value as 'list')}
                  className="text-oxblood-primary focus:ring-oxblood-primary/30"
                />
                <span className="text-sm text-gray-700">Email List</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="individual"
                  checked={sendOption === 'individual'}
                  onChange={(e) => setSendOption(e.target.value as 'individual')}
                  className="text-oxblood-primary focus:ring-oxblood-primary/30"
                />
                <span className="text-sm text-gray-700">Individual Recipients</span>
              </label>
            </div>
          </div>

          {sendOption === 'list' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Email List
              </label>
              <select
                value={formData.list_id}
                onChange={(e) => setFormData({ ...formData, list_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
              >
                <option value="">Select a list</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.subscriber_count} subscribers)
                  </option>
                ))}
              </select>
            </div>
          )}

          {sendOption === 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Recipients
              </label>

              <div className="mb-4 flex gap-2">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="Add custom email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                />
                <button
                  type="button"
                  onClick={onAddCustomEmail}
                  className="px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
                >
                  Add
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
                {subscribers.map((subscriber) => (
                  <label
                    key={subscriber.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(subscriber.email)}
                      onChange={() => onToggleEmail(subscriber.email)}
                      className="rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary/30"
                    />
                    <span className="text-sm text-gray-700">
                      {subscriber.first_name && subscriber.last_name
                        ? `${subscriber.first_name} ${subscriber.last_name} - ${subscriber.email}`
                        : subscriber.email}
                    </span>
                  </label>
                ))}
                {selectedEmails
                  .filter((email) => !subscribers.find((s) => s.email === email))
                  .map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-2 bg-oxblood-primary/10 rounded"
                    >
                      <span className="text-sm text-gray-700">{email}</span>
                      <button
                        onClick={() => onToggleEmail(email)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>

              {selectedEmails.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {selectedEmails.length} recipient{selectedEmails.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onRequestSend(selectedCampaign.id)}
            className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
          >
            <Send size={18} />
            Send Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

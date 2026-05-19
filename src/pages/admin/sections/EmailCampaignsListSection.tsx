// src/pages/admin/sections/EmailCampaignsListSection.tsx
import { Trash2, Send } from 'lucide-react';
import { ConfirmDialog } from '../../../components/admin';

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

type Props = {
  campaigns: Campaign[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  deleteId: string | null;
  setDeleteId: (v: string | null) => void;
  confirmSendId: string | null;
  setConfirmSendId: (v: string | null) => void;
  onSendCampaign: (campaign: Campaign) => void;
  onConfirmDelete: () => void;
  onConfirmSend: () => void;
};

function getStatusColor(status: string) {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'scheduled': return 'bg-oxblood-primary/10 text-oxblood-primary';
    case 'sending': return 'bg-yellow-100 text-yellow-800';
    case 'sent': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function EmailCampaignsListSection({
  campaigns,
  loading,
  searchQuery,
  setSearchQuery,
  deleteId,
  setDeleteId,
  confirmSendId,
  setConfirmSendId,
  onSendCampaign,
  onConfirmDelete,
  onConfirmSend,
}: Props) {
  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search campaigns..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-oxblood-primary focus:outline-none mb-4"
      />

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading campaigns...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Send className="mx-auto mb-4 text-gray-400" size={48} />
                    <p>
                      {campaigns.length === 0
                        ? 'No campaigns yet. Create your first campaign!'
                        : 'No campaigns match your search.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        {campaign.sent_at &&
                          `Sent: ${new Date(campaign.sent_at).toLocaleString()}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
 campaign.status
 )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.recipient_count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.sent_count > 0 && `${campaign.sent_count} sent`}
                      {campaign.failed_count > 0 && `, ${campaign.failed_count} failed`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => onSendCampaign(campaign)}
                            className="flex items-center gap-1 px-3 py-1 bg-oxblood-primary text-[#0f2333] text-sm rounded hover:bg-oxblood-hover/80"
                          >
                            <Send size={14} />
                            Send
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(campaign.id)}
                          className="text-gray-600 hover:text-red-600"
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

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Campaign"
        message="Are you sure? This action cannot be undone."
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmDialog
        open={!!confirmSendId}
        title="Send Campaign?"
        message="This will send emails to all selected recipients. This action cannot be undone."
        confirmLabel="Send"
        variant="warning"
        onConfirm={() => {
          setConfirmSendId(null);
          onConfirmSend();
        }}
        onCancel={() => setConfirmSendId(null)}
      />
    </>
  );
}

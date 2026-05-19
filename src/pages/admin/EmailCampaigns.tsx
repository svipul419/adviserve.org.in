import { useEffect, useRef, useState, useCallback } from 'react';
import { adminDb } from '../../lib/adminDb';
import { EmailCampaignFormSection } from './sections/EmailCampaignFormSection';
import { EmailCampaignsListSection } from './sections/EmailCampaignsListSection';
import { EmailRecipientModalSection } from './sections/EmailRecipientModalSection';
import { EmailCampaignsHeader } from './sections/EmailCampaignsHeader';
import {
  type Campaign,
  type EmailTemplate,
  type EmailList,
  type EmailSubscriber,
  type EmailCampaignFormData,
} from './sections/emailCampaignTypes';

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [lists, setLists] = useState<EmailList[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sendOption, setSendOption] = useState<'list' | 'individual'>('list');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<EmailCampaignFormData>({
    name: '',
    template_id: '',
    list_id: '',
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const closeRecipientModal = useCallback(() => {
    setShowRecipientModal(false);
    setSelectedCampaign(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!showRecipientModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRecipientModal();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      if (modalRef.current) {
        const first = modalRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      }
    });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRecipientModal, closeRecipientModal]);

  const fetchData = async () => {
    setLoading(true);

    const [campaignsRes, templatesRes, listsRes, subscribersRes] = await Promise.all([
      adminDb.from('email_campaigns').select('*').order('created_at', { ascending: false }),
      adminDb.from('email_templates').select('id, name, subject').eq('is_active', true),
      adminDb.from('email_lists').select('id, name, subscriber_count').eq('is_active', true),
      adminDb.from('email_subscribers').select('id, email, first_name, last_name').eq('status', 'active'),
    ]);

    if (!campaignsRes.error) setCampaigns(campaignsRes.data || []);
    if (!templatesRes.error) setTemplates(templatesRes.data || []);
    if (!listsRes.error) setLists(listsRes.data || []);
    if (!subscribersRes.error) setSubscribers(subscribersRes.data || []);

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    if (!formData.template_id) {
      setError('Please select an email template');
      return;
    }

    setSubmitting(true);
    const { error: campaignError } = await adminDb
      .from('email_campaigns')
      .insert([{
        name: formData.name,
        template_id: formData.template_id,
        list_id: formData.list_id || null,
        status: 'draft',
      }]);

    if (campaignError) {
      console.error('Error creating campaign:', campaignError);
      setError(`Failed to create campaign: ${campaignError.message}`);
      setSubmitting(false);
      return;
    }

    setSuccess('Campaign created successfully!');
    setTimeout(() => {
      setShowForm(false);
      setFormData({ name: '', template_id: '', list_id: '' });
      setSuccess(null);
      setSubmitting(false);
      fetchData();
    }, 1500);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('email_campaigns')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting campaign:', error);
    } else {
      fetchData();
    }
    setDeleteId(null);
  };

  const handleSendCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowRecipientModal(true);
    setSelectedEmails([]);
    setCustomEmail('');
  };

  const handleAddCustomEmail = () => {
    if (customEmail && customEmail.includes('@')) {
      setSelectedEmails([...selectedEmails, customEmail]);
      setCustomEmail('');
    }
  };

  const handleToggleEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((em) => em !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleConfirmSend = async () => {
    if (!selectedCampaign) return;
    setError(null);
    setSuccess(null);

    let recipientEmails: string[] = [];

    if (sendOption === 'list' && formData.list_id) {
      const { data: listSubscribers } = await adminDb
        .from('email_list_subscribers')
        .select('subscriber:email_subscribers(email)')
        .eq('list_id', formData.list_id);

      if (listSubscribers) {
        recipientEmails = (
          listSubscribers
            .map((ls: { subscriber?: { email?: string } }) => ls.subscriber?.email) as (string | undefined)[]
        ).filter((e): e is string => typeof e === 'string');
      }
    } else if (sendOption === 'individual') {
      recipientEmails = selectedEmails;
    }

    if (recipientEmails.length === 0) {
      setError('No recipients selected');
      return;
    }

    const recipients = recipientEmails.map((email) => ({
      campaign_id: selectedCampaign.id,
      email,
      status: 'pending',
    }));

    const { error: recipientsError } = await adminDb
      .from('email_campaign_recipients')
      .insert(recipients);

    if (recipientsError) {
      setError(`Failed to add recipients: ${recipientsError.message}`);
      return;
    }

    const { error: updateError } = await adminDb
      .from('email_campaigns')
      .update({
        status: 'sending',
        recipient_count: recipientEmails.length,
        sent_at: new Date().toISOString(),
      })
      .eq('id', selectedCampaign.id);

    if (updateError) {
      setError(`Failed to update campaign: ${updateError.message}`);
      return;
    }

    setSuccess(`Campaign sent to ${recipientEmails.length} recipients!`);
    setTimeout(() => {
      setShowRecipientModal(false);
      setSelectedCampaign(null);
      setSuccess(null);
      fetchData();
    }, 2000);
  };

  return (
    <div>
      <EmailCampaignsHeader onCreateCampaign={() => setShowForm(true)} />

      {showForm && (
        <EmailCampaignFormSection
          formData={formData}
          setFormData={setFormData}
          templates={templates}
          lists={lists}
          error={error}
          success={success}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setError(null);
          }}
        />
      )}

      <EmailCampaignsListSection
        campaigns={campaigns}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        confirmSendId={confirmSendId}
        setConfirmSendId={setConfirmSendId}
        onSendCampaign={handleSendCampaign}
        onConfirmDelete={confirmDelete}
        onConfirmSend={handleConfirmSend}
      />

      {showRecipientModal && selectedCampaign && (
        <EmailRecipientModalSection
          modalRef={modalRef}
          selectedCampaign={selectedCampaign}
          lists={lists}
          subscribers={subscribers}
          sendOption={sendOption}
          setSendOption={setSendOption}
          selectedEmails={selectedEmails}
          customEmail={customEmail}
          setCustomEmail={setCustomEmail}
          formData={formData}
          setFormData={setFormData}
          error={error}
          success={success}
          onToggleEmail={handleToggleEmail}
          onAddCustomEmail={handleAddCustomEmail}
          onClose={closeRecipientModal}
          onRequestSend={(campaignId) => setConfirmSendId(campaignId)}
        />
      )}
    </div>
  );
}

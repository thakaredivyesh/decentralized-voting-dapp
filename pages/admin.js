import CandidateManagement from "../components/admin/CandidateManagement";
import VoterManagement from "../components/admin/VoterManagement";
import VotingSettings from "../components/admin/VotingSettings";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <CandidateManagement />
      <VoterManagement />
      <VotingSettings />
    </div>
  );
}

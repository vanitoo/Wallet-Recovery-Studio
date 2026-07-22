import { foundationProfiles } from "@/features/wallet-profiles/data/foundation-profiles";

const modes = [
  { title: "Find a known address", text: "Match a public address against documented Bitcoin derivation profiles.", state: "Planned for v0.3" },
  { title: "Inspect recovery material", text: "Validate format and checksum locally without storing secrets.", state: "Planned for v0.2" },
  { title: "Explore derivation paths", text: "Review standard and custom paths in a controlled expert workspace.", state: "Planned for v0.5" },
];

export function RecoveryWorkspace() {
  return (
    <main className="workspace">
      <section className="hero panel">
        <div>
          <p className="eyebrow">v0.1 · Foundation</p>
          <h2>Recover the derivation logic, not the secret.</h2>
          <p className="lead">A local diagnostic workspace for understanding why a valid recovery phrase produces unexpected wallet addresses.</p>
        </div>
        <div className="security-card">
          <strong>No secret input yet</strong>
          <p>Cryptographic processing will only be added after the threat model, test vectors and dependency review are complete.</p>
        </div>
      </section>

      <section className="grid three-columns" aria-label="Recovery modes">
        {modes.map((mode) => (
          <article className="panel mode-card" key={mode.title}>
            <span className="tag">{mode.state}</span>
            <h3>{mode.title}</h3>
            <p>{mode.text}</p>
            <button type="button" disabled>Not available in foundation build</button>
          </article>
        ))}
      </section>

      <section className="grid two-columns">
        <article className="panel">
          <p className="eyebrow">Bitcoin-first scope</p>
          <h3>Foundation profiles</h3>
          <div className="profile-list">
            {foundationProfiles.map((profile) => (
              <div className="profile-row" key={profile.id}>
                <div><strong>{profile.label}</strong><span>{profile.standard} · {profile.addressType}</span></div>
                <code>{profile.path}</code>
              </div>
            ))}
          </div>
        </article>
        <article className="panel">
          <p className="eyebrow">Safety boundary</p>
          <h3>What this application will not do</h3>
          <ul className="boundary-list">
            <li>Store or transmit recovery phrases.</li>
            <li>Brute-force missing seed words.</li>
            <li>Sign transactions or hold funds.</li>
            <li>Query public balance APIs without explicit consent.</li>
            <li>Claim that browser memory is perfectly secure.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

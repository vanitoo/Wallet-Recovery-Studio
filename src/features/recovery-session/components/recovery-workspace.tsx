import { RecoverySearchForm } from "@/features/recovery/components/recovery-search-form";
import { foundationProfiles } from "@/features/wallet-profiles/data/foundation-profiles";

export function RecoveryWorkspace() {
  return (
    <main className="workspace">
      <section className="hero panel">
        <div>
          <p className="eyebrow">v0.2 · Seed Inspector и поиск адреса</p>
          <h2>Найдите правильный путь кошелька по знакомому адресу.</h2>
          <p className="lead">
            Введите корректную BIP39 seed-фразу, необязательную passphrase и публичный Bitcoin-адрес,
            который раньше принадлежал кошельку. Проверка выполняется локально в браузере.
          </p>
        </div>
        <div className="security-card">
          <strong>Seed не отправляется в сеть</strong>
          <p>
            Приложение не использует аналитику, localStorage или внешние API. Для значимых средств
            рекомендуется скачанная офлайн-сборка на отдельном доверенном компьютере.
          </p>
        </div>
      </section>

      <RecoverySearchForm />

      <section className="grid two-columns">
        <article className="panel">
          <p className="eyebrow">Поддерживаемые профили</p>
          <h3>Стандартные пути Bitcoin</h3>
          <p>
            По умолчанию проверяются account 0–4, ветки получения и сдачи, индексы 0–19.
            Диапазоны можно ограниченно расширить перед поиском.
          </p>
          <div className="profile-list">
            {foundationProfiles.map((profile) => (
              <div className="profile-row" key={profile.id}>
                <div>
                  <strong>{profile.label}</strong>
                  <span>{profile.standard} · {profile.addressType}</span>
                </div>
                <code>{profile.path}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Границы безопасности</p>
          <h3>Чего приложение не делает</h3>
          <ul className="boundary-list">
            <li>Не сохраняет и не передаёт seed-фразы.</li>
            <li>Не подбирает отсутствующие слова или BIP39 passphrase.</li>
            <li>Не проверяет баланс и историю через публичные API.</li>
            <li>Не подписывает транзакции и не хранит средства.</li>
            <li>Не гарантирует безопасность заражённой системы или расширений браузера.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

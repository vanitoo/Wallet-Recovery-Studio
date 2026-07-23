import { foundationProfiles } from "@/features/wallet-profiles/data/foundation-profiles";

const modes = [
  {
    title: "Найти известный адрес",
    text: "Сравнить публичный Bitcoin-адрес с документированными профилями деривации.",
    state: "Запланировано на v0.3",
  },
  {
    title: "Проверить seed-фразу",
    text: "Локально проверить формат, словарь и контрольную сумму без сохранения секретов.",
    state: "Запланировано на v0.2",
  },
  {
    title: "Исследовать пути деривации",
    text: "Просматривать стандартные и пользовательские пути в контролируемом экспертном режиме.",
    state: "Запланировано на v0.5",
  },
];

export function RecoveryWorkspace() {
  return (
    <main className="workspace">
      <section className="hero panel">
        <div>
          <p className="eyebrow">v0.1.1 · База профилей кошельков</p>
          <h2>Ищем структуру кошелька, а не подбираем секрет.</h2>
          <p className="lead">
            Локальная студия помогает понять, почему корректная seed-фраза в другом приложении
            создаёт неожиданные адреса или показывает нулевой баланс.
          </p>
        </div>
        <div className="security-card">
          <strong>Ввод секретных данных пока отключён</strong>
          <p>
            Работа с seed-фразой появится только после проверки криптографических зависимостей,
            официальных тестовых векторов и правил очистки чувствительных данных.
          </p>
        </div>
      </section>

      <section className="grid three-columns" aria-label="Режимы восстановления">
        {modes.map((mode) => (
          <article className="panel mode-card" key={mode.title}>
            <span className="tag">{mode.state}</span>
            <h3>{mode.title}</h3>
            <p>{mode.text}</p>
            <button type="button" disabled>
              Пока недоступно
            </button>
          </article>
        ))}
      </section>

      <section className="grid two-columns">
        <article className="panel">
          <p className="eyebrow">Bitcoin — первая поддерживаемая сеть</p>
          <h3>Стандартные профили деривации</h3>
          <p>
            База прошла структурную проверку. Диапазоны поиска по умолчанию: учётные записи 0–4,
            ветки 0 и 1, индексы 0–19.
          </p>
          <div className="profile-list">
            {foundationProfiles.map((profile) => (
              <div className="profile-row" key={profile.id}>
                <div>
                  <strong>{profile.label}</strong>
                  <span>
                    {profile.standard} · {profile.addressType}
                  </span>
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
            <li>Не подписывает транзакции и не хранит средства.</li>
            <li>Не обращается к публичным API балансов без явного согласия.</li>
            <li>Не обещает абсолютную безопасность памяти браузера.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

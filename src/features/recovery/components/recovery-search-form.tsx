"use client";

import { useMemo, useRef, useState } from "react";
import {
  inspectMnemonic,
  searchKnownAddress,
  type RecoveryMatch,
  type SearchProgress,
  type SupportedProfile,
} from "../lib/recovery-search";

const PROFILE_OPTIONS: { id: SupportedProfile; label: string }[] = [
  { id: "bip44", label: "BIP44 · устаревшие адреса 1…" },
  { id: "bip49", label: "BIP49 · вложенный SegWit 3…" },
  { id: "bip84", label: "BIP84 · нативный SegWit bc1q…" },
  { id: "bip86", label: "BIP86 · Taproot bc1p…" },
];

export function RecoverySearchForm() {
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [knownAddress, setKnownAddress] = useState("");
  const [profiles, setProfiles] = useState<SupportedProfile[]>(["bip44", "bip49", "bip84", "bip86"]);
  const [accountEnd, setAccountEnd] = useState(4);
  const [indexEnd, setIndexEnd] = useState(19);
  const [progress, setProgress] = useState<SearchProgress | null>(null);
  const [match, setMatch] = useState<RecoveryMatch | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const inspection = useMemo(() => inspectMnemonic(mnemonic), [mnemonic]);
  const total = profiles.length * (accountEnd + 1) * 2 * (indexEnd + 1);

  function toggleProfile(profile: SupportedProfile) {
    setProfiles((current) => current.includes(profile) ? current.filter((item) => item !== profile) : [...current, profile]);
  }

  function clearSensitiveData() {
    abortRef.current?.abort();
    setMnemonic("");
    setPassphrase("");
    setKnownAddress("");
    setProgress(null);
    setMatch(null);
    setMessage("Чувствительные данные удалены из состояния страницы. Для дополнительной очистки закройте вкладку браузера.");
    setRunning(false);
  }

  async function startSearch() {
    setMessage(null);
    setMatch(null);
    if (!inspection.validChecksum) {
      setMessage("Seed-фраза не прошла проверку BIP39 checksum. Сейчас поддерживается английский словарь BIP39.");
      return;
    }
    if (!knownAddress.trim()) {
      setMessage("Введите хотя бы один известный Bitcoin-адрес.");
      return;
    }
    if (profiles.length === 0) {
      setMessage("Выберите хотя бы один профиль поиска.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(true);
    try {
      const result = await searchKnownAddress({
        mnemonic,
        passphrase,
        knownAddress,
        profiles,
        accountEnd,
        indexEnd,
        signal: controller.signal,
        onProgress: setProgress,
      });
      setMatch(result);
      setMessage(result ? null : `Совпадение не найдено после проверки ${total.toLocaleString("ru-RU")} адресов.`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") setMessage("Поиск остановлен пользователем.");
      else setMessage(error instanceof Error ? error.message : "Не удалось выполнить поиск.");
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }

  return (
    <section className="panel recovery-tool" aria-labelledby="recovery-search-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Рабочий локальный поиск</p>
          <h2 id="recovery-search-title">Найти путь по известному адресу</h2>
        </div>
        <span className="status-pill">Сеть отключена</span>
      </div>

      <div className="warning-box">
        Используйте скачанную локальную сборку на доверенном компьютере. История буфера обмена и браузерные расширения могут видеть введённую seed-фразу.
      </div>

      <div className="form-grid">
        <label className="field field-wide">
          <span>Seed-фраза BIP39</span>
          <textarea value={mnemonic} onChange={(event) => setMnemonic(event.target.value)} rows={4} spellCheck={false} autoComplete="off" placeholder="Введите 12, 15, 18, 21 или 24 английских слова" />
          <small>{mnemonic ? `${inspection.wordCount} слов · ${inspection.validChecksum ? "checksum корректен" : "checksum не подтверждён"}` : "Фраза хранится только в памяти открытой страницы."}</small>
        </label>

        <label className="field">
          <span>BIP39 passphrase</span>
          <input type="password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} autoComplete="off" placeholder="Необязательно" />
          <small>Неверная passphrase создаёт другой, но корректный кошелёк.</small>
        </label>

        <label className="field">
          <span>Известный Bitcoin-адрес</span>
          <input value={knownAddress} onChange={(event) => setKnownAddress(event.target.value)} autoComplete="off" spellCheck={false} placeholder="1…, 3…, bc1q… или bc1p…" />
          <small>Например, адрес из истории вывода с биржи.</small>
        </label>
      </div>

      <fieldset className="profile-picker">
        <legend>Профили поиска</legend>
        {PROFILE_OPTIONS.map((option) => (
          <label key={option.id} className="check-option">
            <input type="checkbox" checked={profiles.includes(option.id)} onChange={() => toggleProfile(option.id)} />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="range-grid">
        <label className="field"><span>Последний account</span><input type="number" min={0} max={20} value={accountEnd} onChange={(event) => setAccountEnd(Math.min(20, Math.max(0, Number(event.target.value))))} /></label>
        <label className="field"><span>Последний index</span><input type="number" min={0} max={100} value={indexEnd} onChange={(event) => setIndexEnd(Math.min(100, Math.max(0, Number(event.target.value))))} /></label>
        <div className="estimate"><span>Будет проверено</span><strong>{total.toLocaleString("ru-RU")} адресов</strong></div>
      </div>

      {progress && (
        <div className="progress-box">
          <progress max={progress.total} value={progress.checked} />
          <span>{progress.checked.toLocaleString("ru-RU")} / {progress.total.toLocaleString("ru-RU")} · {progress.profile.toUpperCase()} · account {progress.account} · ветка {progress.change} · index {progress.index}</span>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

      {match && (
        <article className="match-card">
          <p className="eyebrow">Совпадение найдено</p>
          <h3>{match.standard} · {match.scriptType}</h3>
          <dl>
            <div><dt>Путь</dt><dd><code>{match.path}</code></dd></div>
            <div><dt>Account</dt><dd>{match.account}</dd></div>
            <div><dt>Ветка</dt><dd>{match.change === 0 ? "Получение" : "Сдача"}</dd></div>
            <div><dt>Индекс</dt><dd>{match.index}</dd></div>
            <div><dt>Адрес</dt><dd><code>{match.address}</code></dd></div>
            <div><dt>Уверенность</dt><dd>Высокая: известный адрес совпал полностью</dd></div>
          </dl>
        </article>
      )}

      <div className="actions">
        <button className="primary-button" type="button" onClick={startSearch} disabled={running}>{running ? "Идёт поиск…" : "Начать поиск"}</button>
        {running && <button className="secondary-button" type="button" onClick={() => abortRef.current?.abort()}>Остановить</button>}
        <button className="danger-button" type="button" onClick={clearSensitiveData}>Очистить чувствительные данные</button>
      </div>
    </section>
  );
}

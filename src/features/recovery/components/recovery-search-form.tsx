"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  inferProfilesForAddresses,
  inspectMnemonic,
  parseKnownAddresses,
  validateBitcoinAddress,
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

type SearchState = "idle" | "running" | "paused";

type WorkerMessage =
  | { type: "progress"; payload: SearchProgress }
  | { type: "match"; payload: RecoveryMatch }
  | { type: "paused" }
  | { type: "resumed" }
  | { type: "stopped" }
  | { type: "complete"; payload: { matches: RecoveryMatch[]; checked: number; total: number } }
  | { type: "error"; payload: string };

export function RecoverySearchForm() {
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [knownAddressesText, setKnownAddressesText] = useState("");
  const [profiles, setProfiles] = useState<SupportedProfile[]>(["bip44", "bip49", "bip84", "bip86"]);
  const [accountEnd, setAccountEnd] = useState(4);
  const [indexEnd, setIndexEnd] = useState(19);
  const [progress, setProgress] = useState<SearchProgress | null>(null);
  const [matches, setMatches] = useState<RecoveryMatch[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const workerRef = useRef<Worker | null>(null);

  const inspection = useMemo(() => inspectMnemonic(mnemonic), [mnemonic]);
  const knownAddresses = useMemo(() => parseKnownAddresses(knownAddressesText), [knownAddressesText]);
  const validAddresses = useMemo(() => knownAddresses.filter(validateBitcoinAddress), [knownAddresses]);
  const invalidAddresses = useMemo(() => knownAddresses.filter((address) => !validateBitcoinAddress(address)), [knownAddresses]);
  const suggestedProfiles = useMemo(() => inferProfilesForAddresses(validAddresses), [validAddresses]);
  const total = profiles.length * (accountEnd + 1) * 2 * (indexEnd + 1);
  const running = searchState !== "idle";

  useEffect(() => () => workerRef.current?.terminate(), []);

  function finishWorker() {
    workerRef.current?.terminate();
    workerRef.current = null;
    setSearchState("idle");
  }

  function toggleProfile(profile: SupportedProfile) {
    setProfiles((current) => current.includes(profile) ? current.filter((item) => item !== profile) : [...current, profile]);
  }

  function applySuggestedProfiles() {
    if (suggestedProfiles.length === 0) {
      setMessage("Не удалось определить профиль по введённым адресам.");
      return;
    }
    setProfiles(suggestedProfiles);
    setMessage(`Выбраны совместимые профили: ${suggestedProfiles.map((item) => item.toUpperCase()).join(", ")}.`);
  }

  function clearSensitiveData() {
    workerRef.current?.postMessage({ type: "stop" });
    finishWorker();
    setMnemonic("");
    setPassphrase("");
    setKnownAddressesText("");
    setProgress(null);
    setMatches([]);
    setMessage("Чувствительные данные удалены из состояния страницы и рабочего потока. Для дополнительной очистки закройте вкладку браузера.");
  }

  function stopSearch() {
    workerRef.current?.postMessage({ type: "stop" });
    setMessage("Останавливаем поиск…");
  }

  function togglePause() {
    if (searchState === "running") workerRef.current?.postMessage({ type: "pause" });
    if (searchState === "paused") workerRef.current?.postMessage({ type: "resume" });
  }

  function startSearch() {
    setMessage(null);
    setMatches([]);
    setProgress(null);

    if (!inspection.validChecksum) {
      setMessage("Seed-фраза не прошла проверку BIP39 checksum. Сейчас поддерживается английский словарь BIP39.");
      return;
    }
    if (knownAddresses.length === 0) {
      setMessage("Введите хотя бы один известный Bitcoin-адрес.");
      return;
    }
    if (invalidAddresses.length > 0) {
      setMessage(`Исправьте некорректные адреса: ${invalidAddresses.join(", ")}`);
      return;
    }
    if (profiles.length === 0) {
      setMessage("Выберите хотя бы один профиль поиска.");
      return;
    }

    finishWorker();
    const worker = new Worker(new URL("../workers/recovery-search.worker.ts", import.meta.url));
    workerRef.current = worker;
    setSearchState("running");

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const data = event.data;
      if (data.type === "progress") {
        setProgress(data.payload);
        return;
      }
      if (data.type === "match") {
        setMatches((current) => current.some((item) => item.address === data.payload.address) ? current : [...current, data.payload]);
        return;
      }
      if (data.type === "paused") {
        setSearchState("paused");
        setMessage("Поиск приостановлен. Текущая позиция сохранена в рабочем потоке.");
        return;
      }
      if (data.type === "resumed") {
        setSearchState("running");
        setMessage("Поиск продолжен с сохранённой позиции.");
        return;
      }
      if (data.type === "stopped") {
        setMessage("Поиск остановлен пользователем.");
        finishWorker();
        return;
      }
      if (data.type === "error") {
        setMessage(data.payload);
        finishWorker();
        return;
      }

      setMatches(data.payload.matches);
      if (data.payload.matches.length === 0) {
        setMessage(`Совпадения не найдены после проверки ${data.payload.checked.toLocaleString("ru-RU")} адресов.`);
      } else if (data.payload.matches.length < knownAddresses.length) {
        setMessage(`Найдено ${data.payload.matches.length} из ${knownAddresses.length} известных адресов. Для остальных увеличьте диапазон или выберите дополнительные профили.`);
      } else {
        setMessage(`Найдены все известные адреса: ${data.payload.matches.length} из ${knownAddresses.length}.`);
      }
      finishWorker();
    };

    worker.onerror = () => {
      setMessage("Рабочий поток поиска завершился с ошибкой.");
      finishWorker();
    };

    worker.postMessage({
      type: "start",
      payload: { mnemonic, passphrase, knownAddresses, profiles, accountEnd, indexEnd },
    });
  }

  return (
    <section className="panel recovery-tool" aria-labelledby="recovery-search-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Рабочий локальный поиск</p>
          <h2 id="recovery-search-title">Найти пути по известным адресам</h2>
        </div>
        <span className="status-pill">Web Worker · сеть отключена</span>
      </div>

      <div className="warning-box">
        Используйте скачанную локальную сборку на доверенном компьютере. История буфера обмена и браузерные расширения могут видеть введённую seed-фразу.
      </div>

      <div className="form-grid">
        <label className="field field-wide">
          <span>Seed-фраза BIP39</span>
          <textarea value={mnemonic} onChange={(event) => setMnemonic(event.target.value)} rows={4} spellCheck={false} autoComplete="off" placeholder="Введите 12, 15, 18, 21 или 24 английских слова" disabled={running} />
          <small>{mnemonic ? `${inspection.wordCount} слов · ${inspection.validChecksum ? "checksum корректен" : "checksum не подтверждён"}` : "Фраза хранится только в памяти открытой страницы."}</small>
        </label>

        <label className="field">
          <span>BIP39 passphrase</span>
          <input type="password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} autoComplete="off" placeholder="Необязательно" disabled={running} />
          <small>Неверная passphrase создаёт другой, но корректный кошелёк.</small>
        </label>

        <label className="field">
          <span>Известные Bitcoin-адреса</span>
          <textarea value={knownAddressesText} onChange={(event) => setKnownAddressesText(event.target.value)} rows={4} autoComplete="off" spellCheck={false} placeholder={"По одному адресу на строку\n1…\n3…\nbc1q…\nbc1p…"} disabled={running} />
          <small>{knownAddresses.length === 0 ? "Можно вставить несколько адресов через новую строку, пробел или запятую." : `${validAddresses.length} корректных${invalidAddresses.length ? ` · ${invalidAddresses.length} с ошибкой` : ""}`}</small>
        </label>
      </div>

      <fieldset className="profile-picker" disabled={running}>
        <legend>Профили поиска</legend>
        {PROFILE_OPTIONS.map((option) => (
          <label key={option.id} className="check-option">
            <input type="checkbox" checked={profiles.includes(option.id)} onChange={() => toggleProfile(option.id)} />
            <span>{option.label}</span>
          </label>
        ))}
        <button className="profile-auto-button" type="button" onClick={applySuggestedProfiles} disabled={validAddresses.length === 0 || running}>Подобрать по адресам</button>
      </fieldset>

      <div className="range-grid">
        <label className="field"><span>Последний account</span><input type="number" min={0} max={20} value={accountEnd} disabled={running} onChange={(event) => setAccountEnd(Math.min(20, Math.max(0, Number(event.target.value))))} /></label>
        <label className="field"><span>Последний index</span><input type="number" min={0} max={100} value={indexEnd} disabled={running} onChange={(event) => setIndexEnd(Math.min(100, Math.max(0, Number(event.target.value))))} /></label>
        <div className="estimate"><span>Будет проверено</span><strong>{total.toLocaleString("ru-RU")} адресов</strong><small>Целей: {knownAddresses.length}</small></div>
      </div>

      {progress && (
        <div className="progress-box">
          <progress max={progress.total} value={progress.checked} />
          <span>{progress.checked.toLocaleString("ru-RU")} / {progress.total.toLocaleString("ru-RU")} · найдено {progress.found} из {progress.targets} · {progress.profile.toUpperCase()} · account {progress.account} · ветка {progress.change} · index {progress.index}</span>
        </div>
      )}

      {message && <div className="message-box">{message}</div>}

      {matches.length > 0 && (
        <div className="matches-list">
          {matches.map((match) => (
            <article className="match-card" key={`${match.address}-${match.path}`}>
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
          ))}
        </div>
      )}

      <div className="actions">
        <button className="primary-button" type="button" onClick={startSearch} disabled={running}>{running ? searchState === "paused" ? "Поиск на паузе" : "Идёт поиск…" : "Начать поиск"}</button>
        {running && <button className="secondary-button" type="button" onClick={togglePause}>{searchState === "paused" ? "Продолжить" : "Пауза"}</button>}
        {running && <button className="secondary-button" type="button" onClick={stopSearch}>Остановить</button>}
        <button className="danger-button" type="button" onClick={clearSensitiveData}>Очистить чувствительные данные</button>
      </div>
    </section>
  );
}

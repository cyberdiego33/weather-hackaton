export function renderWeather(message: string): void {
  const el = document.createElement("p");
  el.textContent = `Weather says: ${message}`;
  document.body.appendChild(el);
}

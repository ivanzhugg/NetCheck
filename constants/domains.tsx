export const Domains = [
	{ id: 'tbank', label: 'T-Bank', url: 'https://tbank.ru' },
	{ id: 'sber', label: 'Сбербанк', url: 'https://sberbank.ru' },
	{ id: 'alfabank', label: 'Alfa-Bank', url: 'https://alfabank.ru' },
	{ id: 'vtb', label: 'ВТБ', url: 'https://vtb.ru' },
	{ id: 'tg', label: 'Telegram', url: 'https://web.telegram.org' },
	{ id: 'whatsapp', label: 'WhatsApp', url: 'https://whatsapp.com' },
	{ id: 'vk', label: 'VK', url: 'https://vk.com' },
	{ id: 'g', label: 'Google', url: 'https://google.com' },
	{ id: 'yandex', label: 'Яндекс', url: 'https://yandex.ru' },
	{ id: 'spotify', label: 'Spotify', url: 'https://spotify.com' },
] as const

export type Domains = (typeof Domains)[number]

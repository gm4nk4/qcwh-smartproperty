export type VisitorBlacklistType = 'visitor' | 'vehicle' | 'enterprise';

export interface VisitorBlacklistItem {
	id: string;
	type: VisitorBlacklistType;
	name: string;
	identityValue: string;
	reasonDescription: string;
	remark: string;
	creator: string;
	createTime: string;
}

export interface VisitorBlacklistPageParams {
	type?: VisitorBlacklistType | '';
	name?: string;
	identityValue?: string;
	current: number;
	size: number;
}

export interface VisitorBlacklistPageData {
	records: VisitorBlacklistItem[];
	total: number;
	current: number;
	size: number;
}

export interface CreateVisitorBlacklistParams {
	type: VisitorBlacklistType;
	name: string;
	identityValue: string;
	reasonDescription: string;
	remark: string;
}

const blacklistReasonMap: Record<VisitorBlacklistType, string> = {
	visitor: '禁止来访与被邀',
	vehicle: '禁止来访与被邀',
	enterprise: '禁止该公司人员发起邀约',
};

const seedBlacklistRecords: VisitorBlacklistItem[] = [
	{
		id: 'blacklist-1',
		type: 'visitor',
		name: '刘小军',
		identityValue: '13511111111',
		reasonDescription: blacklistReasonMap.visitor,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-2',
		type: 'visitor',
		name: '张二虎',
		identityValue: '13511111112',
		reasonDescription: blacklistReasonMap.visitor,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-3',
		type: 'enterprise',
		name: '入驻企业001',
		identityValue: '',
		reasonDescription: blacklistReasonMap.enterprise,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-4',
		type: 'enterprise',
		name: '入驻企业002',
		identityValue: '',
		reasonDescription: blacklistReasonMap.enterprise,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-5',
		type: 'enterprise',
		name: '入驻企业003',
		identityValue: '',
		reasonDescription: blacklistReasonMap.enterprise,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-6',
		type: 'vehicle',
		name: '鄂A452685',
		identityValue: '鄂A452685',
		reasonDescription: blacklistReasonMap.vehicle,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-7',
		type: 'vehicle',
		name: '鄂A52222',
		identityValue: '鄂A52222',
		reasonDescription: blacklistReasonMap.vehicle,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
	{
		id: 'blacklist-8',
		type: 'vehicle',
		name: '鄂A57777',
		identityValue: '鄂A57777',
		reasonDescription: blacklistReasonMap.vehicle,
		remark: '不遵守管理条例',
		creator: '张三',
		createTime: '2023-08-06 12:00',
	},
];

let blacklistRecords = seedBlacklistRecords.map((item) => ({ ...item }));
let blacklistIdSeed = blacklistRecords.length + 1;

const formatDateTime = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const filterByKeyword = (source: string, keyword?: string) => {
	if (!keyword) return true;
	return normalizeText(source).includes(normalizeText(keyword));
};

export const getVisitorBlacklistPage = async (params: VisitorBlacklistPageParams): Promise<{ code: number; data: VisitorBlacklistPageData }> => {
	const filtered = blacklistRecords.filter((item) => {
		return (
			(!params.type || item.type === params.type) &&
			filterByKeyword(item.name, params.name) &&
			filterByKeyword(item.identityValue || '-', params.identityValue)
		);
	});

	const start = (params.current - 1) * params.size;
	const end = start + params.size;

	return Promise.resolve({
		code: 0,
		data: {
			records: filtered.slice(start, end).map((item) => ({ ...item })),
			total: filtered.length,
			current: params.current,
			size: params.size,
		},
	});
};

export const createVisitorBlacklist = async (params: CreateVisitorBlacklistParams): Promise<{ code: number; data: VisitorBlacklistItem }> => {
	const newRecord: VisitorBlacklistItem = {
		id: `blacklist-${blacklistIdSeed++}`,
		type: params.type,
		name: params.name.trim(),
		identityValue: params.identityValue.trim(),
		reasonDescription: params.reasonDescription || blacklistReasonMap[params.type],
		remark: params.remark.trim(),
		creator: '当前用户',
		createTime: formatDateTime(new Date()),
	};

	blacklistRecords = [newRecord, ...blacklistRecords];

	return Promise.resolve({
		code: 0,
		data: { ...newRecord },
	});
};

export const removeVisitorBlacklist = async (id: string): Promise<{ code: number }> => {
	blacklistRecords = blacklistRecords.filter((item) => item.id !== id);
	return Promise.resolve({ code: 0 });
};

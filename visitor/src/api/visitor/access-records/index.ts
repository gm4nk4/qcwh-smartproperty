export type VisitorAccessStatus = 'pending_visit' | 'completed' | 'expired';
export type VisitorAccessPassType = 'enter' | 'exit';
export type VisitorAccessPassMethod = 'vehicle' | 'person_scan';

export interface VisitorAccessRecordPassItem {
	id: string;
	passTime: string;
	passType: VisitorAccessPassType;
	passMethod: VisitorAccessPassMethod;
	licensePlate: string;
	passLocation: string;
	captureUrl: string;
}

export interface VisitorAccessRecordItem {
	id: string;
	appointmentNo: string;
	launchTime: string;
	passTime: string;
	passType: VisitorAccessPassType;
	passMethod: VisitorAccessPassMethod;
	licensePlate: string;
	passLocation: string;
	captureUrl: string;
	visitorName: string;
	visitorPhone: string;
	visitedName: string;
	visitedEnterprise: string;
	visitedPhone: string;
	status: VisitorAccessStatus;
}

export interface VisitorAccessRecordDetail extends VisitorAccessRecordItem {
	passRecords: VisitorAccessRecordPassItem[];
}

export interface VisitorAccessRecordPageParams {
	visitorName?: string;
	visitorPhone?: string;
	licensePlate?: string;
	visitedEnterprise?: string;
	visitedName?: string;
	passType?: string;
	passMethod?: string;
	appointmentNo?: string;
	passLocation?: string;
	current: number;
	size: number;
}

export interface VisitorAccessRecordPageData {
	records: VisitorAccessRecordItem[];
	total: number;
	current: number;
	size: number;
}

const createCaptureUrl = (text: string, accent: string) => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
		<rect width="160" height="120" rx="16" fill="#f8fafc" />
		<rect x="18" y="18" width="124" height="84" rx="12" fill="${accent}" opacity="0.14" />
		<path d="M54 74l17-18 15 14 20-23 16 27H54z" fill="${accent}" opacity="0.9" />
		<circle cx="102" cy="44" r="8" fill="${accent}" opacity="0.8" />
		<text x="80" y="104" font-size="12" text-anchor="middle" fill="#475569">${text}</text>
	</svg>`;
	return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const accessRecordDetails: VisitorAccessRecordDetail[] = [
	{
		id: '1',
		appointmentNo: 'FK-001',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'enter',
		passMethod: 'vehicle',
		licensePlate: '鄂A452685',
		passLocation: '东大门门闸',
		captureUrl: createCaptureUrl('东大门门闸', '#3b82f6'),
		visitorName: '李小强',
		visitorPhone: '13242772221',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称9',
		visitedPhone: '13242772221',
		status: 'pending_visit',
		passRecords: [
			{
				id: '1-1',
				passTime: '2023-08-06 12:00',
				passType: 'enter',
				passMethod: 'vehicle',
				licensePlate: '鄂A452685',
				passLocation: '东大门门闸',
				captureUrl: createCaptureUrl('东大门门闸', '#3b82f6'),
			},
		],
	},
	{
		id: '2',
		appointmentNo: 'FK-002',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'enter',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: createCaptureUrl('1栋公区大堂', '#8b5cf6'),
		visitorName: '赵国伟',
		visitorPhone: '13242772222',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称10',
		visitedPhone: '13242772222',
		status: 'pending_visit',
		passRecords: [
			{
				id: '2-1',
				passTime: '2023-08-06 12:00',
				passType: 'enter',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: createCaptureUrl('1栋公区大堂', '#8b5cf6'),
			},
		],
	},
	{
		id: '3',
		appointmentNo: 'FK-003',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'exit',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: '',
		visitorName: '张小娟',
		visitorPhone: '13242772223',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称11',
		visitedPhone: '13242772223',
		status: 'completed',
		passRecords: [
			{
				id: '3-1',
				passTime: '2023-08-06 12:00',
				passType: 'exit',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: '',
			},
		],
	},
	{
		id: '4',
		appointmentNo: 'FK-004',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'enter',
		passMethod: 'vehicle',
		licensePlate: '鄂A452685',
		passLocation: '东大门门闸',
		captureUrl: createCaptureUrl('车辆通行', '#22c55e'),
		visitorName: '赵伟华',
		visitorPhone: '13242772224',
		visitedName: '李中华',
		visitedEnterprise: '单位名称12',
		visitedPhone: '13242772224',
		status: 'completed',
		passRecords: [
			{
				id: '4-1',
				passTime: '2023-08-06 12:00',
				passType: 'enter',
				passMethod: 'vehicle',
				licensePlate: '鄂A452685',
				passLocation: '东大门门闸',
				captureUrl: createCaptureUrl('车辆通行', '#22c55e'),
			},
		],
	},
	{
		id: '5',
		appointmentNo: 'FK-005',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'enter',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: '',
		visitorName: '牛小丽',
		visitorPhone: '13242772225',
		visitedName: '李中华',
		visitedEnterprise: '单位名称13',
		visitedPhone: '13242772225',
		status: 'completed',
		passRecords: [
			{
				id: '5-1',
				passTime: '2023-08-06 12:00',
				passType: 'enter',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: '',
			},
		],
	},
	{
		id: '6',
		appointmentNo: 'FK-006',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'exit',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: '',
		visitorName: '李江宁',
		visitorPhone: '13242772226',
		visitedName: '李中华',
		visitedEnterprise: '单位名称14',
		visitedPhone: '13242772226',
		status: 'completed',
		passRecords: [
			{
				id: '6-1',
				passTime: '2023-08-06 12:00',
				passType: 'exit',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: '',
			},
		],
	},
	{
		id: '7',
		appointmentNo: 'FK-007',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'exit',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: '',
		visitorName: '陈百树',
		visitorPhone: '13242772227',
		visitedName: '李中华',
		visitedEnterprise: '单位名称15',
		visitedPhone: '13242772227',
		status: 'expired',
		passRecords: [
			{
				id: '7-1',
				passTime: '2023-08-06 12:00',
				passType: 'exit',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: '',
			},
		],
	},
	{
		id: '8',
		appointmentNo: 'FK-008',
		launchTime: '2023-08-06 12:00',
		passTime: '2023-08-06 12:00',
		passType: 'exit',
		passMethod: 'person_scan',
		licensePlate: '-',
		passLocation: '1栋公区大堂',
		captureUrl: '',
		visitorName: '张国寿',
		visitorPhone: '13242772228',
		visitedName: '李中华',
		visitedEnterprise: '单位名称16',
		visitedPhone: '13242772228',
		status: 'expired',
		passRecords: [
			{
				id: '8-1',
				passTime: '2023-08-06 12:00',
				passType: 'exit',
				passMethod: 'person_scan',
				licensePlate: '-',
				passLocation: '1栋公区大堂',
				captureUrl: '',
			},
		],
	},
];

const filterText = (source: string, keyword?: string) => {
	if (!keyword) return true;
	return source.toLowerCase().includes(keyword.toLowerCase());
};

export const getVisitorAccessRecordPage = async (
	params: VisitorAccessRecordPageParams
): Promise<{ code: number; data: VisitorAccessRecordPageData }> => {
	const filtered = accessRecordDetails.filter((item) => {
		return (
			filterText(item.visitorName, params.visitorName) &&
			filterText(item.visitorPhone, params.visitorPhone) &&
			filterText(item.licensePlate, params.licensePlate) &&
			filterText(item.visitedEnterprise, params.visitedEnterprise) &&
			filterText(item.visitedName, params.visitedName) &&
			filterText(item.appointmentNo, params.appointmentNo) &&
			filterText(item.passLocation, params.passLocation) &&
			(!params.passType || item.passType === params.passType) &&
			(!params.passMethod || item.passMethod === params.passMethod)
		);
	});

	const start = (params.current - 1) * params.size;
	const end = start + params.size;

	return Promise.resolve({
		code: 0,
		data: {
			records: filtered.slice(start, end).map(({ passRecords: _passRecords, ...item }) => item),
			total: filtered.length,
			current: params.current,
			size: params.size,
		},
	});
};

export const getVisitorAccessRecordDetail = async (id: string): Promise<{ code: number; data: VisitorAccessRecordDetail }> => {
	const current = accessRecordDetails.find((item) => item.id === id) || accessRecordDetails[0];
	return Promise.resolve({
		code: 0,
		data: current,
	});
};

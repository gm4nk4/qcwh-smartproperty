export type VisitorAppointmentStatus = 'pending_visit' | 'completed' | 'expired';

export interface VisitorAppointmentPassRecord {
	id: string;
	passTime: string;
	passType: 'enter' | 'exit';
	passMethod: string;
	licensePlate: string;
	passLocation: string;
	captureUrl: string;
}

export interface VisitorAppointmentItem {
	id: string;
	appointmentNo: string;
	visitorName: string;
	visitorPhone: string;
	visitReason: string;
	visitorCount: number;
	appointmentTime: string;
	visitorVehicleNo: string;
	gateNames: string;
	visitedName: string;
	visitedEnterprise: string;
	visitedPhone: string;
	launchTime: string;
	status: VisitorAppointmentStatus;
}

export interface VisitorAppointmentDetail extends VisitorAppointmentItem {
	passRecords: VisitorAppointmentPassRecord[];
}

export interface VisitorAppointmentPageParams {
	visitorName?: string;
	visitorPhone?: string;
	visitorVehicleNo?: string;
	visitedEnterprise?: string;
	visitedName?: string;
	status?: VisitorAppointmentStatus | '';
	current: number;
	size: number;
}

export interface VisitorAppointmentPageData {
	records: VisitorAppointmentItem[];
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

const appointmentDetails: VisitorAppointmentDetail[] = [
	{
		id: '1',
		appointmentNo: 'FK-001',
		visitorName: '李小璇',
		visitorPhone: '13242772221',
		visitReason: '商务合作',
		visitorCount: 1,
		appointmentTime: '2023-08-08 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称9',
		visitedPhone: '13242772221',
		launchTime: '2023-08-08 12:00',
		status: 'pending_visit',
		passRecords: [],
	},
	{
		id: '2',
		appointmentNo: 'FK-002',
		visitorName: '赵国伟',
		visitorPhone: '13242772222',
		visitReason: '商务合作',
		visitorCount: 2,
		appointmentTime: '2023-08-07 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称10',
		visitedPhone: '13242772222',
		launchTime: '2023-08-07 12:00',
		status: 'pending_visit',
		passRecords: [],
	},
	{
		id: '3',
		appointmentNo: 'FK-003',
		visitorName: '张小娟',
		visitorPhone: '13242772223',
		visitReason: '商务合作',
		visitorCount: 1,
		appointmentTime: '2023-08-06 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '陈天奇',
		visitedEnterprise: '单位名称11',
		visitedPhone: '13242772223',
		launchTime: '2023-08-06 12:00',
		status: 'completed',
		passRecords: [
			{
				id: '3-1',
				passTime: '2023-08-06 12:18',
				passType: 'enter',
				passMethod: '车辆通行',
				licensePlate: '鄂A452685',
				passLocation: '东大门门闸',
				captureUrl: createCaptureUrl('商务合作-入场', '#3b82f6'),
			},
		],
	},
	{
		id: '4',
		appointmentNo: 'FK-004',
		visitorName: '赵伟华',
		visitorPhone: '13242772224',
		visitReason: '园区参观',
		visitorCount: 2,
		appointmentTime: '2023-08-05 12:00',
		visitorVehicleNo: '-',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '李中华',
		visitedEnterprise: '单位名称12',
		visitedPhone: '13242772224',
		launchTime: '2023-08-05 12:00',
		status: 'completed',
		passRecords: [
			{
				id: '4-1',
				passTime: '2023-08-06 12:00',
				passType: 'enter',
				passMethod: '车辆通行',
				licensePlate: '鄂A452685',
				passLocation: '东大门门闸',
				captureUrl: createCaptureUrl('园区参观-抓拍', '#10b981'),
			},
		],
	},
	{
		id: '5',
		appointmentNo: 'FK-005',
		visitorName: '牛小丽',
		visitorPhone: '13242772225',
		visitReason: '园区参观',
		visitorCount: 1,
		appointmentTime: '2023-08-04 12:00',
		visitorVehicleNo: '-',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '李中华',
		visitedEnterprise: '单位名称13',
		visitedPhone: '13242772225',
		launchTime: '2023-08-04 12:00',
		status: 'completed',
		passRecords: [
			{
				id: '5-1',
				passTime: '2023-08-04 12:16',
				passType: 'enter',
				passMethod: '步行通行',
				licensePlate: '',
				passLocation: '访客闸机A口',
				captureUrl: createCaptureUrl('步行通行', '#8b5cf6'),
			},
		],
	},
	{
		id: '6',
		appointmentNo: 'FK-006',
		visitorName: '李江宁',
		visitorPhone: '13242772226',
		visitReason: '访亲访友',
		visitorCount: 2,
		appointmentTime: '2023-08-03 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '李中华',
		visitedEnterprise: '单位名称14',
		visitedPhone: '13242772226',
		launchTime: '2023-08-03 12:00',
		status: 'completed',
		passRecords: [
			{
				id: '6-1',
				passTime: '2023-08-03 12:08',
				passType: 'enter',
				passMethod: '车辆通行',
				licensePlate: '鄂A452685',
				passLocation: '西侧门门闸',
				captureUrl: createCaptureUrl('访亲访友', '#f59e0b'),
			},
		],
	},
	{
		id: '7',
		appointmentNo: 'FK-007',
		visitorName: '陈百树',
		visitorPhone: '13242772227',
		visitReason: '园区参观',
		visitorCount: 1,
		appointmentTime: '2023-08-02 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '李中华',
		visitedEnterprise: '单位名称15',
		visitedPhone: '13242772227',
		launchTime: '2023-08-02 12:00',
		status: 'expired',
		passRecords: [],
	},
	{
		id: '8',
		appointmentNo: 'FK-008',
		visitorName: '张国寿',
		visitorPhone: '13242772228',
		visitReason: '园区参观',
		visitorCount: 2,
		appointmentTime: '2023-08-01 12:00',
		visitorVehicleNo: '鄂A452685',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '李中华',
		visitedEnterprise: '单位名称16',
		visitedPhone: '13242772228',
		launchTime: '2023-08-01 12:00',
		status: 'expired',
		passRecords: [],
	},
	{
		id: '9',
		appointmentNo: 'FK-009',
		visitorName: '王志鸿',
		visitorPhone: '13242772229',
		visitReason: '商务合作',
		visitorCount: 3,
		appointmentTime: '2023-07-31 09:30',
		visitorVehicleNo: '鄂B77123',
		gateNames: '2栋大堂、2栋8F门禁',
		visitedName: '刘文浩',
		visitedEnterprise: '单位名称17',
		visitedPhone: '13242772229',
		launchTime: '2023-07-31 08:40',
		status: 'completed',
		passRecords: [
			{
				id: '9-1',
				passTime: '2023-07-31 09:28',
				passType: 'enter',
				passMethod: '车辆通行',
				licensePlate: '鄂B77123',
				passLocation: '2号岗门闸',
				captureUrl: createCaptureUrl('商务合作-2号岗', '#0ea5e9'),
			},
		],
	},
	{
		id: '10',
		appointmentNo: 'FK-010',
		visitorName: '孙语彤',
		visitorPhone: '13242772230',
		visitReason: '项目沟通',
		visitorCount: 2,
		appointmentTime: '2023-07-30 15:00',
		visitorVehicleNo: '-',
		gateNames: '1栋工区大堂、1栋15F电梯井禁',
		visitedName: '周雨菲',
		visitedEnterprise: '单位名称18',
		visitedPhone: '13242772230',
		launchTime: '2023-07-30 13:20',
		status: 'pending_visit',
		passRecords: [],
	},
	{
		id: '11',
		appointmentNo: 'FK-011',
		visitorName: '杜明浩',
		visitorPhone: '13242772231',
		visitReason: '园区参观',
		visitorCount: 1,
		appointmentTime: '2023-07-29 11:20',
		visitorVehicleNo: '鄂C90211',
		gateNames: '访客中心、展示厅',
		visitedName: '罗思远',
		visitedEnterprise: '单位名称19',
		visitedPhone: '13242772231',
		launchTime: '2023-07-29 10:10',
		status: 'completed',
		passRecords: [
			{
				id: '11-1',
				passTime: '2023-07-29 11:18',
				passType: 'enter',
				passMethod: '车辆通行',
				licensePlate: '鄂C90211',
				passLocation: '访客中心岗亭',
				captureUrl: createCaptureUrl('访客中心', '#22c55e'),
			},
		],
	},
	{
		id: '12',
		appointmentNo: 'FK-012',
		visitorName: '顾天宇',
		visitorPhone: '13242772232',
		visitReason: '访亲访友',
		visitorCount: 1,
		appointmentTime: '2023-07-28 18:00',
		visitorVehicleNo: '-',
		gateNames: '东侧人行通道',
		visitedName: '周海峰',
		visitedEnterprise: '单位名称20',
		visitedPhone: '13242772232',
		launchTime: '2023-07-28 16:50',
		status: 'expired',
		passRecords: [],
	},
];

const filterText = (source: string, keyword?: string) => {
	if (!keyword) return true;
	return source.toLowerCase().includes(keyword.toLowerCase());
};

export const getVisitorAppointmentPage = async (
	params: VisitorAppointmentPageParams
): Promise<{ code: number; data: VisitorAppointmentPageData }> => {
	const filtered = appointmentDetails.filter((item) => {
		return (
			filterText(item.visitorName, params.visitorName) &&
			filterText(item.visitorPhone, params.visitorPhone) &&
			filterText(item.visitorVehicleNo, params.visitorVehicleNo) &&
			filterText(item.visitedEnterprise, params.visitedEnterprise) &&
			filterText(item.visitedName, params.visitedName) &&
			(!params.status || item.status === params.status)
		);
	});

	const start = (params.current - 1) * params.size;
	const end = start + params.size;

	return Promise.resolve({
		code: 0,
		data: {
			records: filtered.slice(start, end).map(({ passRecords, ...item }) => item),
			total: filtered.length,
			current: params.current,
			size: params.size,
		},
	});
};

export const getVisitorAppointmentDetail = async (id: string): Promise<{ code: number; data: VisitorAppointmentDetail }> => {
	const current = appointmentDetails.find((item) => item.id === id) || appointmentDetails[0];
	return Promise.resolve({
		code: 0,
		data: current,
	});
};

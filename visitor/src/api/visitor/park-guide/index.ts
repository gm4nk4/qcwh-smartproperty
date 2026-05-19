export interface VisitorParkGuideDetail {
	id: string;
	title: string;
	markdownContent: string;
	updatedBy: string;
	updatedTime: string;
}

export interface SaveVisitorParkGuideParams {
	markdownContent: string;
}

let visitorParkGuideState: VisitorParkGuideDetail = {
	id: 'park-guide-1',
	title: '园区访客管理说明',
	markdownContent: `为保障您在我园区期间的安全和健康，我们有必要对您进行安全告知。您的行为对保护您自身的安全健康非常重要，请承诺并遵守以下规定：

## 一、通用要求
1. 请听从接待人员及警卫的引导，遵守园区现场安全管理制度、指示、标识要求。
2. 禁止进入与您来访业务无关的场所。
3. 未经许可，请勿录像和拍照。
4. 除固定吸烟点外，其他区域禁止吸烟。
5. 请不要在跑、步道周边下蹲围观，以免妨碍现场秩序。
6. 请在无专用道的安全人行通道上或靠右行走，注意行驶的车辆。
7. 如您驾驶车辆，请遵守园内交通规定，将车辆停放在指定地点；停放在重自停靠车位时请将车头朝外，按园区限速标牌和指示要求行驶。（小车30km/h；大车25km/h）。
8. 请保管好您携带的贵重物品。

## 二、紧急情况处置
1. 如您遇到火灾、生产安全等意外事故发生时，请保护好您的自身安全，并第一时间通知您的接待人员。
2. 按照消防疏散信息，以最快的速度按地面安全通道的路线疏散。`,
	updatedBy: '张三',
	updatedTime: '2023-08-06 12:00',
};

const formatDateTime = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const cloneGuideDetail = (detail: VisitorParkGuideDetail): VisitorParkGuideDetail => ({
	...detail,
});

export const getVisitorParkGuideDetail = async (): Promise<{ code: number; data: VisitorParkGuideDetail }> => {
	return Promise.resolve({
		code: 0,
		data: cloneGuideDetail(visitorParkGuideState),
	});
};

export const saveVisitorParkGuide = async (params: SaveVisitorParkGuideParams): Promise<{ code: number; data: VisitorParkGuideDetail }> => {
	visitorParkGuideState = {
		...visitorParkGuideState,
		markdownContent: params.markdownContent,
		updatedBy: '当前用户',
		updatedTime: formatDateTime(new Date()),
	};

	return Promise.resolve({
		code: 0,
		data: cloneGuideDetail(visitorParkGuideState),
	});
};

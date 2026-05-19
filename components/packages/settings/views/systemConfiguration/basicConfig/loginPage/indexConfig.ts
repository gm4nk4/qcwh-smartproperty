export const templateData = ref([
	{ label: '模板1', value: '1', bgUrl: 'template1' },
	// { label: '模板2', value: '2',  bgUrl: 'template2'  },
]);

export const templateDrawDownList = new Map([
	['1', [{ label: '注册', value: '1' }]],
	['2', [{ label: '注册', value: '1' }]],
	['3', [{ label: '注册', value: '1' }]],
]);
import portalIcon1 from '/@/assets/login/login1/Group.png';
import portalBg1 from '/@/assets/login/login1/bg.png';
import portalIcon2 from '/@/assets/login/login2/login_bg.svg';
import portalBg2 from '/@/assets/login/login2/bg.png';
export const templateFormData = [
	{
		title: '登录',
		menuDisplay: [],
		backgroundColor: 'rgba(255, 255, 255, 1)',
		middleLogoUrl: portalIcon1,
		backgroundUrl: portalBg1,
		copyRightDisplay: '1',
		templateId: '1', //门户模板
		templateScript: '',
	},
	{
		title: '登录',
		menuDisplay: [],
		backgroundColor: 'rgba(255, 255, 255, 1)',
		middleLogoUrl: portalIcon2,
		backgroundUrl: portalBg2,
		copyRightDisplay: '1',
		templateId: '2', //门户模板
		templateScript: '',
	},
];

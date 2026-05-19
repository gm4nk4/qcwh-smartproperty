import type { SaveVisitorParkGuideParams, VisitorParkGuideDetail } from './api';
import type { VisitorParkGuideFormData } from './index';

const escapeHtml = (value: string) => {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

const getSafeHref = (value: string) => {
	const href = value.trim();
	return /^(https?:\/\/|mailto:)/i.test(href) ? escapeHtml(href) : '#';
};

const applyInlineMarkdown = (value: string) => {
	let result = escapeHtml(value);
	result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
		return `<a href="${getSafeHref(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
	});
	result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
	result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	return result;
};

export const renderMarkdownToHtml = (markdown: string) => {
	const normalizedMarkdown = markdown.trim();
	if (!normalizedMarkdown) {
		return '<p>暂无内容</p>';
	}

	const lines = normalizedMarkdown.replace(/\r\n/g, '\n').split('\n');
	const htmlParts: string[] = [];
	let listType: 'ol' | 'ul' | '' = '';
	let inCodeBlock = false;
	let codeBuffer: string[] = [];

	const closeList = () => {
		if (!listType) return;
		htmlParts.push(`</${listType}>`);
		listType = '';
	};

	const closeCodeBlock = () => {
		if (!inCodeBlock) return;
		htmlParts.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`);
		inCodeBlock = false;
		codeBuffer = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();

		if (/^```/.test(trimmed)) {
			closeList();
			if (inCodeBlock) {
				closeCodeBlock();
			} else {
				inCodeBlock = true;
				codeBuffer = [];
			}
			continue;
		}

		if (inCodeBlock) {
			codeBuffer.push(escapeHtml(line));
			continue;
		}

		if (!trimmed) {
			closeList();
			continue;
		}

		const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
		if (headingMatch) {
			closeList();
			const level = headingMatch[1].length;
			htmlParts.push(`<h${level}>${applyInlineMarkdown(headingMatch[2])}</h${level}>`);
			continue;
		}

		const orderedListMatch = trimmed.match(/^\d+\.\s+(.*)$/);
		if (orderedListMatch) {
			if (listType !== 'ol') {
				closeList();
				listType = 'ol';
				htmlParts.push('<ol>');
			}
			htmlParts.push(`<li>${applyInlineMarkdown(orderedListMatch[1])}</li>`);
			continue;
		}

		const unorderedListMatch = trimmed.match(/^[-*+]\s+(.*)$/);
		if (unorderedListMatch) {
			if (listType !== 'ul') {
				closeList();
				listType = 'ul';
				htmlParts.push('<ul>');
			}
			htmlParts.push(`<li>${applyInlineMarkdown(unorderedListMatch[1])}</li>`);
			continue;
		}

		if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
			closeList();
			htmlParts.push('<hr />');
			continue;
		}

		const quoteMatch = trimmed.match(/^>\s?(.*)$/);
		if (quoteMatch) {
			closeList();
			htmlParts.push(`<blockquote><p>${applyInlineMarkdown(quoteMatch[1])}</p></blockquote>`);
			continue;
		}

		closeList();
		htmlParts.push(`<p>${applyInlineMarkdown(trimmed)}</p>`);
	}

	closeList();
	closeCodeBlock();

	return htmlParts.join('');
};

export const buildVisitorParkGuideFormData = (detail: VisitorParkGuideDetail): VisitorParkGuideFormData => {
	return {
		markdownContent: detail.markdownContent,
	};
};

export const buildVisitorParkGuideSavePayload = (formData: VisitorParkGuideFormData): SaveVisitorParkGuideParams => {
	return {
		markdownContent: formData.markdownContent.trim(),
	};
};

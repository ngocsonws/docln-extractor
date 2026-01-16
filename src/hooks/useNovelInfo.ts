/**
 * Hook for loading novel information
 */

import { useState, useEffect, useCallback } from 'react';
import type { NovelInfo } from '@/types';
import {
  getCurrentTab,
  isDocLnUrl,
  checkPage,
  getNovelInfo,
  getUrlParams,
} from '@/services';

export type Status = 'loading' | 'ready' | 'error';

export interface UseNovelInfoResult {
  status: Status;
  statusText: string;
  novelInfo: NovelInfo | null;
  sourceTabId: number | null;
}

export function useNovelInfo(): UseNovelInfoResult {
  const [status, setStatus] = useState<Status>('loading');
  const [statusText, setStatusText] = useState('Đang kiểm tra trang...');
  const [novelInfo, setNovelInfo] = useState<NovelInfo | null>(null);
  const [sourceTabId, setSourceTabId] = useState<number | null>(null);

  const updateStatus = useCallback((text: string, newStatus: Status) => {
    setStatusText(text);
    setStatus(newStatus);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if opened as new tab with URL params
        const { tabId: paramTabId, url: paramUrl } = getUrlParams();

        let tabId: number;
        let tabUrl: string | undefined;

        if (paramTabId && paramUrl) {
          // Opened as new tab - use params
          tabId = paramTabId;
          tabUrl = paramUrl;
        } else {
          // Fallback to current active tab
          const tab = await getCurrentTab();
          if (!tab?.id) {
            updateStatus('Không tìm thấy tab', 'error');
            return;
          }
          tabId = tab.id;
          tabUrl = tab.url;
        }

        setSourceTabId(tabId);

        if (!isDocLnUrl(tabUrl)) {
          updateStatus('Không phải trang docln.net hoặc docln.sbs', 'error');
          return;
        }

        const pageCheck = await checkPage(tabId);

        if (pageCheck.isNovelPage) {
          updateStatus('Đang tải thông tin truyện...', 'loading');

          const info = await getNovelInfo(tabId);
          setNovelInfo(info);
          updateStatus('Sẵn sàng xuất EPUB', 'ready');
        } else if (pageCheck.isChapterPage) {
          updateStatus('Đây là trang chapter', 'error');
        } else {
          updateStatus('Không phải trang truyện', 'error');
        }
      } catch (error) {
        console.error('Init error:', error);
        updateStatus('Lỗi kết nối với trang', 'error');
      }
    };

    init();
  }, [updateStatus]);

  return { status, statusText, novelInfo, sourceTabId };
}

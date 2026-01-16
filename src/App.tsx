import { useState } from 'react';
import { useNovelInfo, useVolumeSelection, useEpubExport } from '@/hooks';
import {
  Header,
  StatusIndicator,
  NovelCard,
  OptionsPanel,
  ProgressPanel,
  EmptyState,
} from '@/components/app';
import { Button } from '@/components/ui/button';

function App() {
  const { status, statusText, novelInfo } = useNovelInfo();

  const {
    selectedVolumes,
    handleSelectAll,
    handleDeselectAll,
    handleVolumeToggle,
  } = useVolumeSelection(novelInfo);

  const { isExtracting, progress, handleExtract } = useEpubExport();

  const [splitVolumes, setSplitVolumes] = useState(false);

  const onExtract = () => {
    if (novelInfo) {
      handleExtract(novelInfo, selectedVolumes, { splitVolumes });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <Header />
        <StatusIndicator status={status} text={statusText} />

        {!novelInfo && status === 'error' && (
          <EmptyState
            message={
              statusText === 'Đây là trang chapter'
                ? 'Please open the novel info page to use this extension.'
                : undefined
            }
          />
        )}

        {novelInfo && (
          <>
            <NovelCard novelInfo={novelInfo} />

            <OptionsPanel
              volumes={novelInfo.volumes}
              selectedVolumes={selectedVolumes}
              splitVolumes={splitVolumes}
              onSplitVolumesChange={setSplitVolumes}
              onVolumeToggle={handleVolumeToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />

            {isExtracting && (
              <ProgressPanel
                percent={progress.percent}
                title={progress.title}
                detail={progress.detail}
              />
            )}

            <div className="px-6 py-4 border-t">
              <Button
                className="w-full"
                onClick={onExtract}
                disabled={isExtracting || selectedVolumes.size === 0}
              >
                {isExtracting ? 'Processing...' : 'Generate EPUB'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

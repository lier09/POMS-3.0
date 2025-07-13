import React from 'react';

interface SortConfiguratorProps {
  value: string;
  onChange: (value: string) => void;
}

const SortConfigurator: React.FC<SortConfiguratorProps> = ({ value, onChange }) => {
  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
      <h3 className="text-lg font-semibold text-slate-800">Custom Sort Order (Optional)</h3>
      <p className="mt-1 text-sm text-slate-500">
        To sort the final results, enter one name per line. Thanks to smart sorting, the app can correctly identify names even with minor typos or homophones (e.g., '尹珅' and '尹深' are treated as the same). Unlisted names will appear at the end.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="mt-4 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="尹珅&#10;张宗禹&#10;(Smart sort enabled: handles homophones like '尹深')"
      />
    </div>
  );
};

export default SortConfigurator;
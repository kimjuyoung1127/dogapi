// ✅ 견종 필터 및 검색 UI 컴포넌트
'use client';

import { Search } from 'lucide-react';

// 임시 타입 정의
type BreedFiltersProps = {
  onSearchChange: (query: string) => void;
  onSizeChange: (size: string) => void;
};

const BreedFilters = ({ onSearchChange, onSizeChange }: BreedFiltersProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="sr-only">견종 검색</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="견종 이름으로 검색..."
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <label htmlFor="size" className="sr-only">크기 필터</label>
          <select
            id="size"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue=""
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="">모든 크기</option>
            <option value="소형견">소형견</option>
            <option value="중형견">중형견</option>
            <option value="대형견">대형견</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BreedFilters;
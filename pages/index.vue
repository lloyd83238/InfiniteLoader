<template>
  <div class="container">
    <h1>無限滾動功能</h1>
    <div
      ref="boxRef"
      class="box"
      @scroll="handleScroll"
    >
      <div
        v-for="record in showList"
        :key="`record-${record.name}`"
        class="data"
      >
        {{ '第' + record.id + '筆資料' }}<br>
        {{ '資料名稱：' + record.name + '筆資料' }}<br>
        {{ '資料內容：' + record.value }}
      </div>
      <div
        v-show="isRefresh"
        class="loader"
      >
        <svgIcon class="refreshIcon" />
      </div>
    </div>
    <span>
      使用說明：往下滾動每十筆產生一個Loading，接著繼續載入十筆資料，總共三十筆。
    </span>
  </div>
</template>
<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// 定義管理滾動狀態, API數據和載入狀態的refs

const boxRef = ref(null);
const list = ref([]);
const showList = ref([]);
const listIndex = ref(10);
const isRefresh = ref(false);
let isLoading = false;

// 防抖函數，避免重複和快速的調用
const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 定義一個異步函數來撈取您的API資料
const getApiData = async (): Promise<void> => {
  try {
    // 使用內建的fetch函數來撈資料。這裡的url為您提供的API網址
    const response = await fetch('https://raw.githubusercontent.com/lloyd83238/restAPI-from-github/main/test.json');

    // 檢查是否成功撈取資料。如果撈取失敗（response.ok回傳false），則丟出錯誤
    if (!response.ok) {
      throw new Error(`Failed to fetch data with status code: ${response.status}`);
    }

    // 若成功撈取資料，則將結果轉為JSON格式，並將其存入list變數
    list.value = await response.json();
  } catch (error) {
    // 如果撈取資料過程中有任何錯誤，則在控制台輸出錯誤消息
  }
};

const loadMore = (): void => {
  // 判断已加载的数据数量是否已达到总数据量，如果是，则不再加载
  if (listIndex.value >= list.value.length) {
    return;
  }

  // 开始加载数据
  isRefresh.value = true;
  isLoading = true;

  // 在1.5秒后加载新的数据。这里使用setTimeout模拟数据加载的延迟效果。
  setTimeout(() => {
    // 从源数据列表中获取新的数据并添加到显示列表中
    const start = listIndex.value;
    const end = start + 10;
    const moreData = list.value.slice(start, end);
    showList.value = [...showList.value, ...moreData];

    // 更新当前已加载的数据数量
    listIndex.value = end;

    // 加载完成，更新加载状态
    isRefresh.value = false;
    isLoading = false;
  }, 1000);
};
// 使用防抖函数包装loadMore，防止在短时间内重复触发
const debouncedLoadMore = debounce(loadMore, 200);

// 處理滾動事件的函數。檢查滾動是否已有到底部。
const handleScroll = () => {
  const box = boxRef.value;

  if (box && (box.scrollHeight - box.scrollTop === box.clientHeight) && !isLoading) {
    debouncedLoadMore();
  }
};

onMounted(async () => {
  await getApiData();
  // 初始塞入前十筆資料
  showList.value = list.value.slice(0, 10);
  boxRef.value.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  boxRef.value.removeEventListener('scroll', handleScroll);
});
</script>
<style scoped>
.container {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.box {
  border: 2px solid #ccc;
  border-radius: 20px;
  height: 200px;
  margin-bottom: 30px;
  overflow-y: auto;
  padding: 10px;
  position: relative;
  width: 100%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  height: 30px;
  position: relative;
}

.refreshIcon {
  animation: spin 2s linear infinite;
  left: 50%;
  opacity: 0.5;
  position: absolute;
  text-align: center;
  top: 5px;
}

.box::-webkit-scrollbar {
  width: 12px;
}

.box::-webkit-scrollbar-track {
  border-radius: 20px;
  margin: 5px 0;
}

.box::-webkit-scrollbar-thumb {
  background-color: #cac9c9;
  border-radius: 20px;
}

.box::-webkit-scrollbar-thumb:hover {
  background-color: #aca7a7;
}
</style>

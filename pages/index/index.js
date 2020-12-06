Page({
  data: {
    toDealList: [],   // 等待去处理的数组
    originalList: [   // 模拟首次加载的数据
      {
        createTime: "2020-12-06",
        id: "1",
      }, {
        createTime: "2020-12-06",
        id: "2",
      }, {
        createTime: "2020-12-06",
        id: "3",
      }, {
        createTime: "2020-12-06",
        id: "4",
      }, {
        createTime: "2020-12-05",
        id: "5",
      }, {
        createTime: "2020-12-05",
        id: "6",
      }, {
        createTime: "2020-12-05",
        id: "7",
      }, {
        createTime: "2020-12-05",
        id: "8",
      }, {
        createTime: "2020-12-05",
        id: "9",
      },
    ],
    backList: [       // 后续的数据 删多少条返回多少条 直到这个数组中没有数据
      {
        createTime: "2020-12-05",
        id: "10",
      }, {
        createTime: "2020-12-05",
        id: "11",
      }, {
        createTime: "2020-12-05",
        id: "12",
      }, {
        createTime: "2020-12-04",
        id: "13",
      }, {
        createTime: "2020-12-04",
        id: "14",
      }, {
        createTime: "2020-12-04",
        id: "15",
      }, {
        createTime: "2020-12-03",
        id: "16",
      }, {
        createTime: "2020-12-03",
        id: "17",
      }, {
        createTime: "2020-12-03",
        id: "18",
      },
    ],
    list: [[]],            // 经过处理的 显示在前端的数据
  },

  // 处理数组的函数
  dealFun() {
    let list = this.data.list
    let toDealList = this.data.toDealList
    console.log(toDealList, '待处理数组')
    // 需保证后台返回的数组长度大于一
    if (toDealList.length > 0) {
      // 将第一个数据放到第一个数组中
      // 如果是第一次处理 数组中的第一个数组会没有数据 需要将第一个待处理数据放到里面 并且从第二个开始循环
      let isFirst = false
      if (list[0].length == 0) {
        isFirst = true
        list[0][0] = toDealList[0]
        toDealList[0].checked = false
      }
      // 如果是第一次处理 数组中的第一个数组会没有数据 需要将第一个待处理数据放到里面 并且从第二个开始循环
      for (let index = (isFirst ? 1 : 0); index < toDealList.length; index++) {
        toDealList[index].checked = false
        // 如果当前的日期 不等于前台展示的数组中的最后一个日期了 就代表当前循环项是前一天的数据了
        // console.log(list[list.length - 1][list[list.length - 1].length - 1])
        if (toDealList[index].createTime != list[list.length - 1][list[list.length - 1].length - 1].createTime) {
          // 重新添加一个空数组 放前的一天的数据
          list.push([])
        }
        // 直接将循环项放到 前端展示的数组中的最后一个数组的最后
        list[list.length - 1].push(toDealList[index])
      }
      console.log(list, '循环完成后的数组')
    }
    this.setData({
      list,
    })
  },

  // 点击选中函数
  choose(e) {
    let indexs = e.target.dataset.indexs
    let index = e.target.dataset.index
    if (index !== undefined) {
      let item = this.data.list[indexs][index]
      item.checked = !item.checked
      // console.log(item)
      this.setData({
        // [`this.data.list[${indexs}][${index}]`]: this.data.list[indexs][index],  // 这样修改 数据已经发生改变 但却不会触发页面更改  是为什么呢
        list: this.data.list,
      })
    }
  },

  // 点击删除
  delete() {
    let list = this.data.list
    let newArr = []
    let delArr = []   // 用于记录当前删除的条数  并可用于向后台发送要删除的数据的id
    // 遍历时直接改变当前遍历的数组 会造成逻辑混乱
    // 所以此处用另外一个数组接住（newArr）
    list.forEach(item => {
      let arr = []      // 定义数组 一会存放每一天的记录
      item.forEach(i => {
        if (i.checked) {
          //  选中的代表要删除的  他的id放到待删除的id的数组中
          delArr.push(i.id)
        } else {
          //  没有被选中的就正常放到新定义的存放每一天的数组中（而不是直接在这截取删除掉该数据 是因为在遍历时直接改变当前遍历的数组会造成逻辑混乱）
          arr.push(i)
        }
      })
      // 此处是为了判断防止把某一天的所有数据都删除掉
      if (arr.length > 0) {
        newArr.push(arr)
      }
    })
    console.log(newArr, '删除完之后的数组（因为是数组（引用型数），打印出来会跟删除完之后处理完的数组是一样的）')
    this.data.list = newArr
    // 模拟后台在删除之后返回数据 将返回数据存贮到待处理函数中
    let backList = this.data.backList.splice(0, delArr.length)
    this.data.toDealList = backList
    this.dealFun()
  },

  onLoad: function () {
    // 模拟后台第一次返回数据 将返回数据存贮到待处理函数中
    this.data.toDealList = this.data.originalList
    this.dealFun()
  },
})

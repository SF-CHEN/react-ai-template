import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface CrudPaginationParams {
  page: number
  pageSize: number
}

interface CrudListResult<TItem> {
  list: TItem[]
  total: number
}

interface CrudService<
  TItem extends { id: string | number },
  TValues,
  TParams extends CrudPaginationParams,
> {
  name: string
  list: (params: TParams) => Promise<CrudListResult<TItem>>
  create: (values: TValues) => Promise<TItem>
  update: (id: TItem['id'], values: TValues) => Promise<TItem>
  remove: (id: TItem['id']) => Promise<void>
}

interface CrudOptions {
  pageSize?: number
}

type CrudFilters<TParams extends CrudPaginationParams> = Omit<TParams, keyof CrudPaginationParams>

export function useCrud<
  TItem extends { id: string | number },
  TValues,
  TParams extends CrudPaginationParams,
>(
  service: CrudService<TItem, TValues, TParams>,
  filters: CrudFilters<TParams>,
  options: CrudOptions = {},
) {
  const queryClient = useQueryClient()
  const [page, setPageState] = useState(1)
  const [pageSize, setPageSizeState] = useState(options.pageSize ?? 10)
  const [dialogOpen, setDialogOpenState] = useState(false)
  const [editingItem, setEditingItem] = useState<TItem | null>(null)

  // filters 本身就是完整列表参数去掉分页字段后的类型，这里补回分页即可交给 service.list
  const params = { ...filters, page, pageSize } as TParams
  const listQuery = useQuery({
    queryKey: [service.name, 'list', params],
    queryFn: () => service.list(params),
  })

  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const refresh = () => queryClient.invalidateQueries({ queryKey: [service.name] })

  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: refresh,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: TItem['id']; values: TValues }) => service.update(id, values),
    onSuccess: refresh,
  })

  const removeMutation = useMutation({
    mutationFn: service.remove,
    onSuccess: refresh,
  })

  const setPage = (nextPage: number) => {
    const safePage = Math.max(1, Math.floor(nextPage))
    setPageState(Math.min(safePage, totalPages))
  }

  const setPageSize = (nextPageSize: number) => {
    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) return
    setPageSizeState(Math.floor(nextPageSize))
    setPageState(1)
  }

  const prevPage = () => setPageState((current) => Math.max(1, current - 1))
  const nextPage = () => setPageState((current) => Math.min(totalPages, current + 1))

  const setDialogOpen = (open: boolean) => {
    setDialogOpenState(open)
    if (!open) setEditingItem(null)
  }

  const create = () => {
    setEditingItem(null)
    setDialogOpenState(true)
  }

  const edit = (item: TItem) => {
    setEditingItem(item)
    setDialogOpenState(true)
  }

  const submit = async (values: TValues) => {
    // 表单结构与接口参数一致时直接透传 values，避免字段越多重复组装越严重
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, values })
    } else {
      await createMutation.mutateAsync(values)
    }

    setDialogOpen(false)
  }

  const remove = async (item: TItem) => {
    await removeMutation.mutateAsync(item.id)

    // 删除当前页最后一条时回到上一页，避免停留在没有数据的空页
    if ((listQuery.data?.list.length ?? 0) === 1 && page > 1) {
      setPageState(page - 1)
    }
  }

  return {
    data: listQuery.data?.list ?? [],
    total,
    page,
    pageSize,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    refetch: listQuery.refetch,
    dialogOpen,
    editingItem,
    submitting: createMutation.isPending || updateMutation.isPending,
    removing: removeMutation.isPending,
    setPage,
    setPageSize,
    prevPage,
    nextPage,
    setDialogOpen,
    create,
    edit,
    submit,
    remove,
  }
}

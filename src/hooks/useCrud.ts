import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface CrudListResult<TItem> {
  list: TItem[]
  total: number
}

interface CrudService<TItem extends { id: string | number }, TValues, TParams> {
  name: string
  list: (params: TParams) => Promise<CrudListResult<TItem>>
  create: (values: TValues) => Promise<TItem>
  update: (id: TItem['id'], values: TValues) => Promise<TItem>
  remove: (id: TItem['id']) => Promise<void>
}

export function useCrud<TItem extends { id: string | number }, TValues, TParams>(
  service: CrudService<TItem, TValues, TParams>,
  params: TParams,
) {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpenState] = useState(false)
  const [editingItem, setEditingItem] = useState<TItem | null>(null)

  const listQuery = useQuery({
    queryKey: [service.name, 'list', params],
    queryFn: () => service.list(params),
  })

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
  }

  return {
    data: listQuery.data?.list ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    refetch: listQuery.refetch,
    dialogOpen,
    editingItem,
    submitting: createMutation.isPending || updateMutation.isPending,
    removing: removeMutation.isPending,
    setDialogOpen,
    create,
    edit,
    submit,
    remove,
  }
}

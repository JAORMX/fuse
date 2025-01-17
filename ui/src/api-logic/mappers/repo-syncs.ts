import { differenceInSeconds } from 'date-fns'
import { RepoSyncData, RepoSyncDataType, SyncStatusDataT } from 'src/@types'
import { getSimpleDurationTime, mapToRepoSyncStateT } from 'src/utils'
import { GITHUB_URL } from 'src/utils/constants'
import { GetRepoSyncsQuery } from '../graphql/generated/schema'

/**
 * Method which iterate each sync and map it to RepoSyncDataType to be shown in table
 * @param data Sync list that comes from data base in GetRepoSyncsQuery format
 * @returns RepoSyncData with syncs info and its RepoSyncDataType info by each sync
 */
const mapToSyncsData = (data: GetRepoSyncsQuery | undefined): RepoSyncData => {
  // General repo info
  const repoData: RepoSyncData = {
    name: data?.repo?.repo.replace(GITHUB_URL, '') || '',
    type: data?.repo?.isGithub ? 'github' : 'other',
  }

  const mappedData: Array<RepoSyncDataType> = []

  data?.repo?.repoSyncs.nodes.forEach((s) => {
    // 1. Get sync info
    const syncData: RepoSyncDataType = {
      data: {
        id: s.id,
        title: s?.syncType.replace(/_/ig, ' ') || '',
        brief: s?.repoSyncTypeBySyncType?.description || '',
      },
      latestRun: s?.repoSyncQueues.nodes[0]?.startedAt ?? s?.repoSyncQueues.nodes[1]?.startedAt,
      status: {
        data: [],
        syncState: s?.repoSyncQueues.nodes.length !== 0 ? mapToRepoSyncStateT(s?.repoSyncQueues.nodes[0]?.status || '') : 'empty',
      }
    }

    // 2. Get status data of a sync (sync queues)
    s?.repoSyncQueues.nodes.forEach((q) => {
      const queueData: SyncStatusDataT = {
        status: mapToRepoSyncStateT(q?.status || ''),
        runningTime: q?.doneAt ? differenceInSeconds(new Date(q?.doneAt), new Date(q?.startedAt)) : 0, // Determine chart height
        runningTimeReadable: q?.doneAt ? getSimpleDurationTime(new Date(q?.startedAt), new Date(q?.doneAt)) : q?.startedAt ? 'running' : 'queued',
        doneAt: q?.doneAt ?? new Date(q?.doneAt)
      }
      syncData.status.data?.push(queueData)
    })

    mappedData.push(syncData)
  })

  repoData.syncs = mappedData
  return repoData
}

export { mapToSyncsData }

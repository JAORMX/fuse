import { Fragment } from 'react'
import Head from 'next/head'
import RepoDataView from 'src/views/repository-data'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import GET_REPO_SYNCS from 'src/api-logic/graphql/queries/get-repo-syncs.query'
import { mapToSyncsData } from 'src/api-logic/mappers/repo-syncs'
import Loading from 'src/components/Loading'
import { showErrorAlert } from 'src/utils/alerts'
import { MERGESTAT_TITLE } from 'src/utils/constants'

const RepoDetailsPage = () => {
  const router = useRouter()
  const { repository } = router.query

  const { loading, error, data } = useQuery(GET_REPO_SYNCS, {
    variables: { id: repository },
    pollInterval: 5000,
  })

  const repo = mapToSyncsData(data)
  const title = `${MERGESTAT_TITLE} ${repo?.name}`

  if (error) {
    showErrorAlert(error.message)
  }

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      {loading ? <Loading /> : <RepoDataView data={repo} />}
    </Fragment>
  )
}

export default RepoDetailsPage

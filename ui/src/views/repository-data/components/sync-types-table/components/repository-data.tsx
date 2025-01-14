import React from 'react'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

export type RepositoryDataProps = {
  id: string
  title: string
  brief?: string
  disabled?: boolean
}
export const RepositoryData: React.FC<RepositoryDataProps> = (props) => {
  const router = useRouter()
  const { repository } = router.query

  return (
    <div className={cx('py-5 flex flex-col justify-center items-start h-full', { 'bg-gray-50': props.disabled })}>
      <Link href={`/repos/${repository}/${props.id}`}>
        <h4 className="font-medium mb-0.5 text-semantic-text cursor-pointer hover_text-blue-600">
          {props.title}
        </h4>
      </Link>

      <p className="text-sm text-semantic-mutedText">
        {props.brief}
      </p>
    </div>
  )
}

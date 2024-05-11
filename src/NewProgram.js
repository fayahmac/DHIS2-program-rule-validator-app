import { useDataMutation } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'

const myMutation = {
    resource: 'programs',
    type: 'create',
    data: {
        name: 'A new Program',
        shortName: 'A new Program',
        programType: 'WITH_REGISTRATION',
    },
}

export const NewProgram = ({ refetch }) => {
    const [mutate, { loading }] = useDataMutation(myMutation)

    const onClick = async () => {
        await mutate()
        refetch()
    }
    return (
        <Button primary small disabled={loading} onClick={onClick}>
            + New
        </Button>
    )
}
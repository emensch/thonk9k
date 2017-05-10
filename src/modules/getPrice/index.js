import module from '../../module'
import command from '../../components/command'
import loader from '../../components/loader'


export default module(
    loader(() => {
        throw new Error('dick')
    }),
    command('getPrice', 'Gets the Jita price of a given item.', () => {
        console.log('running getPrice')
    })
)
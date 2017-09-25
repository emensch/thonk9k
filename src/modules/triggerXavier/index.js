import module from '../../module';
import command from '../../components/command';

export default module(
    command('triggerXavier', 'Triggers Xavier because he loves it', async (state, message, args) => {
        try {
            const triggeringMessages = [
                'funkadelic is shit',
                'oh that one dude who plays one riff...and was only brought back into the spotlight when....lol....Daft Punk was like HURRR do that same riff for us',
                'hey niles, play that one riff people know you for',
                'chromeo is better than niles (who the fuck is niles?)'
                // i guess more stuff that triggers papa X goes here
            ];

            const selectedIndex = Math.floor(Math.random() * triggeringMessages.length) + 1;

            message.channel.send(
                triggeringMessages[selectedIndex]
            );
        } catch (e) {
            throw e;
        }
    });
)

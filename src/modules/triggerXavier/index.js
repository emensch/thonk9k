import module from '../../module';
import command from '../../components/command';

export default module(
    command('triggerxavier', 'Triggers Xavier because he loves it', async (state, message, args) => {
        try {
            const triggeringMessages = [
                'funkadelic is shit',
                'oh that one dude who plays one riff...and was only brought back into the spotlight when....lol....Daft Punk was like HURRR do that same riff for us',
                'hey niles, play that one riff people know you for',
                'chromeo is better than niles (who the fuck is niles?)',
                'Enyos are only good for one thing: Wrecks',
                'Bulleit & Woodford are barely worthy of cleaning the oil stains off my driveway'
                // i guess more stuff that triggers papa X goes here
            ];

            const selectedIndex = Math.floor(Math.random() * triggeringMessages.length);

            message.channel.send(
                '@Xavier W#8307 ' + triggeringMessages[selectedIndex]
            );
        } catch (e) {
            throw e;
        }
    })
)
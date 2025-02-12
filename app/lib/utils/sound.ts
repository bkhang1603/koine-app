import { Audio } from 'expo-av';

class SoundManager {
    private static instance: SoundManager;
    private sounds: { [key: string]: Audio.Sound } = {};
    private isMuted: boolean = false;

    private constructor() {}

    static getInstance() {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    async loadSounds() {
        try {
            const [
                { sound: correctSound },
                { sound: wrongSound },
                { sound: clickSound },
                { sound: completeSound }
            ] = await Promise.all([
                Audio.Sound.createAsync(require('../../../assets/sounds/correct.mp3')),
                Audio.Sound.createAsync(require('../../../assets/sounds/wrong.mp3')),
                Audio.Sound.createAsync(require('../../../assets/sounds/click.mp3')),
                Audio.Sound.createAsync(require('../../../assets/sounds/complete.mp3'))
            ]);

            this.sounds = {
                correct: correctSound,
                wrong: wrongSound,
                click: clickSound,
                complete: completeSound,
            };
        } catch (error) {
            console.log('Error loading sounds:', error);
        }
    }

    async playSound(soundName: 'correct' | 'wrong' | 'click' | 'complete') {
        if (this.isMuted || !this.sounds[soundName]) return;

        try {
            const sound = this.sounds[soundName];
            await sound.setPositionAsync(0);
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    async unloadSounds() {
        try {
            await Promise.all(
                Object.values(this.sounds).map(sound => sound.unloadAsync())
            );
            this.sounds = {};
        } catch (error) {
            console.log('Error unloading sounds:', error);
        }
    }
}

export const soundManager = SoundManager.getInstance();
export default soundManager; 
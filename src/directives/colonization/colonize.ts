import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';
import {ClaimingOverlord} from '../../overlords/colonization/claimer';
import {Colony} from '../../Colony';
import {PioneerOverlord} from '../../overlords/colonization/pioneer';
import {MY_USERNAME} from '../../~settings';
import {log} from '../../console/log';
import {Roles} from '../../creepSetups/setups';

// Claims a new room and builds a spawn but does not incubate. Removes when spawn is constructed.

@profile
export class DirectiveColonize extends Directive {

	static directiveName = 'colonize';
	static color = COLOR_PURPLE;
	static secondaryColor = COLOR_GREY;
	static requiredRCL = 3;

	toColonize: Colony | undefined;
	overlords: {
		claim: ClaimingOverlord;
		pioneer: PioneerOverlord;
	};

	constructor(flag: Flag) {
		super(flag);
		// Register incubation status
		this.toColonize = this.room ? Overmind.colonies[Overmind.colonyMap[this.room.name]] : undefined;
	}

	spawnMoarOverlords() {
		this.overlords.claim = new ClaimingOverlord(this);
		this.overlords.pioneer = new PioneerOverlord(this);
	}

	init() {

	}

	run() {
		if (this.toColonize && this.toColonize.spawns.length > 0) {
			// Reassign all pioneers to be miners and workers
			let miningOverlords = _.map(this.toColonize.miningSites, site => site.overlords.mine);
			for (let pioneer of this.overlords.pioneer.pioneers) {
				let miningOverlord = miningOverlords.shift();
				if (miningOverlord) {
					pioneer.reassign(miningOverlord, Roles.drone);
				} else {
					pioneer.reassign(this.toColonize.overlords.work, Roles.worker);
				}
			}
			// Remove the directive
			this.remove();
		}
		if (Game.time % 10 == 2 && this.room && this.room.owner != MY_USERNAME) {
			log.notify(`Removing Colonize directive in ${this.pos.roomName}: room already owned by another player.`);
			this.remove();
		}
	}
}

import inviteSVG from "../assets/image/invite.svg";

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { RoomItem } from "../stores/room-store";
import { InviteModal } from "./Modal/InviteModal";
import { TopBarRightBtn } from "flat-components";

export interface InviteButtonProps {
    roomInfo?: RoomItem;
}

export const InviteButton = observer<InviteButtonProps>(function InviteButton({ roomInfo }) {
    const [isShowInviteModal, showInviteModal] = useState(false);
    const hideInviteModal = (): void => showInviteModal(false);
    return (
        <div>
            <TopBarRightBtn
                icon={<img src={inviteSVG} />}
                title="Invite"
                onClick={() => showInviteModal(true)}
            />
            {roomInfo && (
                <InviteModal
                    room={roomInfo}
                    visible={isShowInviteModal}
                    onCancel={hideInviteModal}
                    onCopied={hideInviteModal}
                />
            )}
        </div>
    );
});

export default InviteButton;

import { RequestErrorCode, RoomType, isPmiRoom } from "@netless/flat-server-api";
import { roomStore, globalStore } from "@netless/flat-stores";
import { errorTips, message } from "flat-components";
import { FlatI18n } from "@netless/flat-i18n";
import { RouteNameType } from "../../route-config";
import { usePushHistory } from "../../utils/routes";

export const joinRoomHandler = async (
    roomUUID: string,
    pushHistory: ReturnType<typeof usePushHistory>,
): Promise<void> => {
    const formatRoomUUID = roomUUID.replace(/\s+/g, "");

    try {
        const roomInfo = roomStore.rooms.get(formatRoomUUID);
        const periodicUUID = roomInfo?.periodicUUID;
        const data = await roomStore.joinRoom(periodicUUID || formatRoomUUID);
        globalStore.updateShowGuide(data.showGuide);
        globalStore.updatePeriodicUUID(roomInfo?.periodicUUID);

        switch (data.roomType) {
            case RoomType.BigClass: {
                pushHistory(RouteNameType.BigClassPage, data);
                break;
            }
            case RoomType.SmallClass: {
                pushHistory(RouteNameType.SmallClassPage, data);
                break;
            }
            case RoomType.OneToOne: {
                pushHistory(RouteNameType.OneToOnePage, data);
                break;
            }
            default: {
                new Error("failed to join room: incorrect room type");
            }
        }
    } catch (e) {
        // if room not found and is pmi room, show wait for teacher to enter
        if (
            e.message.indexOf(RequestErrorCode.RoomNotFound) > -1 &&
            (await checkPmiRoom(formatRoomUUID))
        ) {
            void message.info(FlatI18n.t("wait-for-teacher-to-enter"));
            return;
        }
        pushHistory(RouteNameType.HomePage);
        errorTips(e);
    }
};

async function checkPmiRoom(uuid: string): Promise<boolean> {
    return /^[0-9]*$/.test(uuid.replace(/\s+/g, "")) && (await isPmiRoom({ pmi: uuid }))?.result;
}
